//Product detail component
import React, { Component } from 'react';
import PageTop from '../utils/page_top';

import ProductInfo from './productInfo';
import ProdImg from './productImages';
import AddToCartComponent from './addToCart';
import CustomRadioGroup from '../utils/radiogroup';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/cart_actions';
import { getProductDetail } from '../../actions/products_actions'; //add this later:clearProductDetail

import AlertDialog from '../utils/alert';
import CustomSnackbar from '../utils/snackbarComponent';

class ProductPage extends Component {

    state={
        size:'',
        color:'',
        quantity:1,
        openAlert:false,
        addSuccess:false
    };


    componentDidMount(){
        const id = this.props.match.params.id; //get the product id
        this.props.dispatch(getProductDetail(id)).then(()=>{ //get product details from db
            console.log("Product_details index:",this.props.products);
            if(!this.props.products.prodDetail){
                this.props.history.push('/'); //if no details found, redirect to home
            }
        })
        .catch((error)=> console.log("index from product detail: getProductDetail: Error in action:",error));
    }

    componentWillUnmount(){
        // this.props.dispatch(clearProductDetail())
    }

    alertClose = () => {
        this.setState({ open: false });
      };

    //runs action to add to cart
    addToCartHandler(id){
        if (this.state.quantity<1 || this.state.size==='' || this.state.color===''){
            // alert("Please select size and color ");
            this.setState({openAlert:true})
            return
        }

        // const cartId=CheckLocalStorage("etsc_id");
        // console.log("Localuserid= ",cartId);

        console.log("product index: addtocartHandler: State=",this.state);
        console.log("product index: addtocartHandler: id=",id);
        this.props.dispatch(addToCart(
            {
                product_Id:id,
                quantity: this.state.quantity, 
                size: this.state.size, 
                color: this.state.color
            })).then(this.setState({addSuccess:true}));
            
    }
    
    //Color State Handler
    colorValueHandler(e){
        console.log("Product Page: target value: ",e.target.value);
        this.setState({color:e.target.value});
    }

    // Handle alert close
    handleAlertClose(){
        this.setState({openAlert: false});
    }

    // Handle snackbar close
    handleSnackbarClose(){
        this.setState({addSuccess: false});
    }

    //size Handler
    sizeValueHandler(e){
        this.setState({size:e.target.value});
    }

    //plus button handler
    plusButtonHandler(){
        let quantity=this.state.quantity;
        
        if (quantity<1) {
            quantity=1;
        } else {
            quantity+=1;
        }
        this.setState({quantity});
    }

    //minus button handler
    minusButtonHandler(){
        let quantity=this.state.quantity;
        
        if (quantity<2) {
            quantity=1;
        } else {
            quantity-=1;
        }
        this.setState({quantity});
    }

    //Number Input box in product info control function
    quantityInputHandler(e){

        if(parseInt(e.target.value,10)<1){
            this.setState({quantity:1});
        } else {
            this.setState({quantity:parseInt(e.target.value,10)});
        }
    }

    render() {
        return (
            <div className="product_detail_container">
                {this.state.addSuccess ?
                    <CustomSnackbar
                        vertical= 'bottom'
                        horizontal= 'left'
                        variant="success"
                        hideAfter="2000"
                        handleClose={()=> this.handleSnackbarClose()}
                        text="Item added to cart!"
                    />
                    :null
                }
                <PageTop
                    linkto="/"
                    linkName="Home"
                />
                <div className="container">
                {this.state.openAlert ?
                    <AlertDialog
                        title="Missing details"
                        text="Please select size and color"
                        open={this.state.openAlert}
                        handleClose={() => this.handleAlertClose()}
                    />
                :null
                }
                    
                {
                    this.props.products.prodDetail ? //if details are not empty
                    <div className="product_detail_wrapper">
                        <div className="left">
                                <ProdImg //images
                                    detail={this.props.products.prodDetail}
                                />
                        </div>
                        <div className="right">
                            <ProductInfo //details
                                detail={this.props.products.prodDetail}
                            />
                            <AddToCartComponent
                                addToCart={(itemDetails)=> this.addToCartHandler(itemDetails)}
                                details={this.props.products.prodDetail}
                                plusaction={()=>this.plusButtonHandler() }
                                minusaction={()=>this.minusButtonHandler() }
                                value={this.state.quantity}
                                onchange={(e)=>this.quantityInputHandler(e)}
                            />
                            <CustomRadioGroup
                                title="Colors"
                                list={this.props.products.prodDetail.colors}
                                value={this.state.color}
                                onchange={(event)=>this.colorValueHandler(event)}
                            />
                            <CustomRadioGroup
                                title="Size"
                                list={this.props.products.prodDetail.size}
                                value={this.state.size}
                                onchange={(event)=>this.sizeValueHandler(event)}
                            />
                        </div>
                    </div>
                    : 'Loading'
                }

                </div>                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products //get products from app state
    }
}

export default connect(mapStateToProps)(ProductPage);