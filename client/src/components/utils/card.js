// Renders a product with description and image
import React, { Component } from 'react';
import MyButton from './button';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/cart_actions';

import AlertDialog from '../utils/alert';
import CustomSnackbar from '../utils/snackbarComponent';

import SelectComponent from '../utils/selectComponent';

class Card extends Component {

    state={
        size:'',
        color:'',
        quantity:1,
        openAlert:false,
        addSuccess:false
    };

//runs action to add to cart
addToCartHandler(id){

    // console.log("Card: addtocartHandler: State=",this.state);
    // console.log("Card: addtocartHandler: id=",id);

    if (this.state.quantity<1 || this.state.size==='' || this.state.color===''){
        
        this.setState({openAlert:true})
        return
    }

    
    this.props.dispatch(addToCart(
        {
            product_Id:id,
            quantity: this.state.quantity, 
            size: this.state.size, 
            color: this.state.color
        })).then(this.setState({addSuccess:true}));
        
}

    renderCardImage(images){
        if(images && images.length > 0){ //if # of images is >0 then return image url
            return images[0].url
        } else {// return the "not available" image
        return '/images/image_not_available.png'
        }
    }

    // Handle alert close
    handleAlertClose(){
        this.setState({openAlert: false});
    }

    // Handle snackbar close
    handleSnackbarClose(){
        this.setState({addSuccess: false});
    }

    handleColorSelect(e){
        this.setState({color:e.target.value});
    }

    handleSizeSelect(e){
        this.setState({size:e.target.value});
    }

    render() {
        const props = this.props;
        // console.log("Card.js: props=",props);
        return (
            <div className={`card_item_wrapper ${props.grid}`}> {/**to choose how we render cards. rows or grid */}
                <div>{this.state.addSuccess ? // Snackbar
                    <CustomSnackbar
                        vertical= 'bottom'
                        horizontal= 'left'
                        variant="success"
                        hideAfter="2000"
                        handleClose={()=> this.handleSnackbarClose()}
                        text="Item added to cart!"
                    />
                    :null
                }</div>
                <div> {/*  allert dialogue */}
                    {this.state.openAlert ?
                        <AlertDialog
                            title="Missing details"
                            text="Please select size and color"
                            open={this.state.openAlert}
                            handleClose={() => this.handleAlertClose()}
                        />
                    :null
                    }
                </div>
                <div
                    className="image"
                    style={{
                       background:`url(${this.renderCardImage(props.images)}) no-repeat`
                    }}
                >  </div>
                    <div className="action_container">
                        <div className="tags">
                            {/* <div className="brand">{props.brand.name}</div> */}
                            <div className="name">{props.name}</div>
                            <div className="price">{props.price}€</div>
                        </div>
                        
                        { props.grid ?//if it's grid style, show description
                            <div className="description">
                                <p>
                                    {props.description}
                                </p>    
                            </div>
                            :null
                        }
                        <div className="colorandsize">
                            <div className="color-select">
                                <SelectComponent 
                                    title="Color"
                                    handleSelect={(color)=> this.handleColorSelect(color)}
                                    list={props.colors}
                                    id="color"
                                    value={this.state.color}
                                />
                            </div>
                            <div className="size-select">
                                <SelectComponent 
                                    title="Size"
                                    handleSelect={(size)=> this.handleSizeSelect(size)}
                                    list={props.size}
                                    id="size"
                                    value={this.state.size}
                                />
                            </div>
                        </div>
                        <div className="actions">
                            <div className="button_wrapp">
                                <MyButton //view product details button
                                    type="default"
                                    altClass="card_link"
                                    title="View product"
                                    linkTo={`/product_detail/${props._id}`}
                                    addStyles={{
                                        margin: '10px 0 0 0'
                                    }}
                                />
                            </div>
                            <div className="button_wrapp">
                                <MyButton //add to cart  button
                                    type="bag_link" 
                                    runAction={(_id)=>{
                                        // props.user.userData.isAuth ? //user is authenticated?
                                            this.addToCartHandler(props._id) //pass product id
                                        
                                            // console.log('you need to log in')
                                    }}
                                />
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Card);