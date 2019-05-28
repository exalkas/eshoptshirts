import React, { Component } from 'react';

import UserProductBlock from './product_block';

import { connect } from 'react-redux';
import { updateCartItem, removeCartItem, getCartItems} from '../../actions/cart_actions';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFrown from '@fortawesome/fontawesome-free-solid/faFrown'

import CircularProgress from '@material-ui/core/CircularProgress';

import CustomSnackbar from '../utils/snackbarComponent';

import MyButton from '../utils/button';

class UserCart extends Component {

    state = {
        loading: true,
        total:0.0,
        showTotal: false,
        showSuccess: false,
        products:[],
        quantity:1,
        addSuccess:false,
        snackText:'',
        snackType:''
    }

    //Loads cart items
    componentDidMount(){
        let cartItems = [];//array to contain all productids in the cart
        let cart = this.props.cart.cart; //for less typing

        console.log("Cart: props=",this.props.cart);
        if(cart){//are there any items into the cart?
            if(cart.length > 0){
                cart.forEach(item=>{
                    if (cartItems.indexOf(item.product_Id)===-1) { //if product id already in the cart, skip
                        cartItems.push(item.product_Id);
                    }
                    
                });
                this.props.dispatch(getCartItems(cartItems,cart))
                .then((productsFromServer)=>{
                    
                    this.updateState(productsFromServer);
                    
                })
            }
        }
    }

    //updates state after actions
    updateState(payload){

        console.log("cart: this.props.cart.cartDetails=",this.props.cart);
        this.setState({products:this.props.cart.cartDetails.map(element => element)});

        console.log("cart.js: responseFromServer=",payload);
        console.log("cart.js: this.state.products=",this.state.products);
        if(this.state.products.length > 0){//if there are products calc total
            this.calculateTotal(this.state.products);
        }
        this.setState({loading:false});
    }

    // Handle snackbar close
    handleSnackbarClose(){
        this.setState({addSuccess: false, snackText:'',snackType:''});
    }

    //minus button handler
    minusButtonHandler(i){
        
        let products=[];

        products=this.state.products;

        if (products[i].quantity<2) {
            products[i].quantity=1;
        } else {
            products[i].quantity-=1;
        }

        this.setState({products});

        // console.log("cart: minusbuttonhandler: state=",this.state.products);
    }

    //plus button handler
    plusButtonHandler(i){
        let products=[];

        products=this.state.products;

        products[i].quantity+=1;

        this.setState({products});
        
        // console.log("cart: plusbuttonhandler: state products=",this.state.products);
    }

    onInputChange(e){

        let products=[];
        const index=parseInt(e.target.id,10);

        products=this.state.products;

        if (parseInt(e.target.value,10)<2) {
            products[index].quantity=1;
        } else {
            products[index].quantity=parseInt(e.target.value,10);
        }

        this.setState({products});
    }

    //sets total. accepts cart
    calculateTotal = (cartDetails) => {
        let total = 0;

        cartDetails.forEach(item=>{//loop through props
            total += item.price * item.quantity
        });

        const finalNum=parseFloat(total.toFixed(2),10);

        this.setState({//update state
            total:finalNum,
            showTotal: true
        });
    }

    //remove from cart. runs action
    removeFromCart = (id, size, color) => {
        
        this.setState({loading:true});

        let product={
            product_Id:id,
            size,
            color
        }

        this.props.dispatch(removeCartItem(product))
        .then((payload)=>{

            this.updateState(payload);

            if(this.props.cart.cart.length <= 0){//if removed last item from cart
                this.setState({
                    showTotal: false //stop showing total
                })
            } else{//needs to recalculate total since product removed from cart
                this.calculateTotal(this.state.products);
            }
        })
    }

    //Compares current state with props and returns true if no change
    compareProductQuantity(product){
        let result=false;
        this.props.cart.cart.forEach(item=>{
            if (item.product_Id===product.product_Id && 
                item.size===product.size && 
                item.color===product.color && 
                item.quantity===product.quantity) 
                result=true;
        })
        return result;
    }


    //remove from cart. runs action
    updateCart = (id, size, color, quantity) => {

        let product={
            product_Id:id,
            size,
            color,
            quantity
        }

        // console.log("cart: updatecart: product,quantity=",product.quantity);

        if (this.compareProductQuantity(product)) {
            this.setState({addSuccess:true,snackText:"There are no changes to submit!", snackType:"warning"});
            return;
        }

        this.props.dispatch(updateCartItem(product))
        .then((payload)=>{

            this.updateState(payload);
            this.setState({addSuccess:true, snackText:"Item Updated!",snackType:"success"});
        })
    }

    //when there are no items in the cart
    showNoItemMessage = () =>(
        <div className="cart_no_items">
            <FontAwesomeIcon icon={faFrown}/>
            <div>
                You have no items
            </div>
            <div className="continue-shopping">
                <MyButton 
                    type="default"
                    linkTo="/"
                    title="Continue Shopping"
                    altClass="cart_remove_btn"
                />
            </div>
        </div>
    )

    render() {
        return (
                <div className="page_cart">
                   
                    {this.state.addSuccess ?
                    <CustomSnackbar
                        vertical= 'bottom'
                        horizontal= 'left'
                        variant={this.state.snackType}
                        hideAfter="2000"
                        handleClose={()=> this.handleSnackbarClose()}
                        text={this.state.snackText}
                    />
                        :null
                    }   
                    <h1 className="cart_header">My cart</h1>
                    
                    <div className="user_cart">
                        {this.state.loading ? <div className="cart_progress"><CircularProgress /></div>:null}
                        {this.props.cart.cartDetails ?  
                        <UserProductBlock
                             products={this.state.products}
                             type="cart"
                             removeItem={(id,size, color)=> this.removeFromCart(id,size, color)}
                             updateItem={(id,size,color,quantity) => this.updateCart(id,size,color,quantity)}
                             plusButtonHandler={i=>this.plusButtonHandler(i)}
                             minusButtonHandler={i=>this.minusButtonHandler(i)}
                             onInputChange={(e,i)=> this.onInputChange(e,i)}
                        /> :null}
                        { this.state.showTotal ? //should we show total?
                            <div className="user_cart_sum">
                                <div>
                                    Total amount: € {this.state.total}
                                </div>
                            </div>
                        :
                            this.showNoItemMessage() //no items in the cart
                        }
                    </div>
                    {
                        this.state.showTotal ? //show paypal when there are items in the cart
                            <div className="user_cart_nav">
                                <div className="continue-shopping">
                                    <MyButton 
                                        type="default"
                                        linkTo="/"
                                        title="Back to Shopping"
                                        altClass="cart_remove_btn"
                                    />
                                </div>
                                <div className="to-checkout">
                                    <MyButton 
                                        type="default"
                                        linkTo="/checkout"
                                        title="Proceed to Checkout"
                                        altClass="cart_remove_btn"
                                    />
                                </div> 
                            </div>
                        :null
                    }

                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user, //get user (includes cart) from state app
        cart : state.cart
    }
}

export default connect(mapStateToProps)(UserCart);