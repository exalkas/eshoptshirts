import React, { Component } from 'react';
import { connect } from 'react-redux';

import { onSuccessBuy } from '../../actions/cart_actions';
import { getShipping} from '../../actions/shipping_actions';

import RenderProducts from './render_products';

import FormField from '../utils/Form/formfield';
import { update, populateOptionFields, isFormValid } from '../utils/Form/formActions';

/// AfbA2-qjz92KhC5IDxvx2UpiIDBmSD7PdlKkZk1-OndNwg7Wc5wVAJKlPWQJcHwioMFz0kn4zOXnbqGW

import CustomSnackbar from '../utils/snackbarComponent';
// import FontAwesomeIcon from './node_modules/@fortawesome/react-fontawesome';
// import faSmile from './node_modules/@fortawesome/fontawesome-free-solid/faSmile'

import Dialog from '@material-ui/core/Dialog';

import Paypal from '../utils/paypal';

class Checkout extends Component {

    state={
        formError: false,
        formSuccess:false,
        formIsValid:false,
        formdata:{
            name: {
                element: 'input',
                value: '',
                config:{
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter your name',
                    label: 'Name:'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            lastname: {
                element: 'input',
                value: '',
                config:{
                    name: 'lastname_input',
                    type: 'text',
                    placeholder: 'Enter your lastname',
                    label: 'Lastname:'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            email: {
                element: 'input',
                value: '',
                config:{
                    name: 'email_input',
                    type: 'email',
                    placeholder: 'Enter your email',
                    label: 'Email:'
                },
                validation:{
                    required: true,
                    email: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            address: {
                element: 'textarea',
                value: '',
                config:{
                    name: 'address_input',
                    type: 'address',
                    placeholder: 'Enter your address',
                    label: 'Address:'
                },
                validation:{
                    required: true,
                    email: false
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            phone: {
                element: 'input',
                value: '',
                config:{
                    name: 'phone_input',
                    type: 'phone',
                    placeholder: 'Enter your phone number',
                    label: "Phone:"
                },
                validation:{
                    required: true,
                    email: false
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            shippingCosts: {
                element: 'select',
                value: 0,
                config:{
                    name: 'shipping_input',
                    label: "Select shipping:",
                    options:[]
                },
                validation:{
                    required: false
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            }
        },
        products:[],
        total:0.0,
        grandTotal:0.0,
        showSnackBar:false,
        snackText:'',
        snackType:''
    }

    componentDidMount(){
        const formdata = this.state.formdata;
        
        this.calcTotal();
        
        this.props.dispatch(getShipping()).then(
            response => {
                
                console.log("checkout: shippings :",response);

                let tmpArr=[];
                
                response.payload.forEach(item => {
                    tmpArr.push({ // add only name and price of each shipping method
                        
                            name:item.shipping_type,
                            price:item.shipping_cost
                        })
                });

                const newFormData = populateOptionFields(formdata,tmpArr,'shippingCosts');
                this.updateFields(newFormData) //update state
        })

        console.log('checkout: componentDidMount: user=',this.props.user.userData.isAuth);
        
    }

    calcTotal(){
        let total=0.0;
        let price=0.0;

        if (!this.props.cart.cart) {
            this.setState({total:0});
            return;
        }

        this.props.cart.cartDetail.forEach(item => {
            console.log("checkout: calctotal: price=",this.props.cart.cartDetail.price);
            price=item.price;
            total+=parseFloat(price.toFixed(2),10)*parseInt(item.quantity,10);
        });

        console.log("checkout: calctotal: tempTotal=",total);

        this.setState({total});
    
    }

    // Handle snackbar close
    handleSnackbarClose(){
        this.setState({showSnackBar: false, snackText:'',snackType:''});
    }
    

    //Show that there is an error
    transactionError = (data) => {
            this.setState({
                showSnackBar:true,
                snackText:`There was an error with the transaction: ${data}`,
                snackType:'error'
        });
        console.log('Paypal error')
    }

    //Show that transaction cancelled
    transactionCanceled = () => {
        console.log('Transaction canceled')
    }

    //Need to hide total, update card and DB, update user history 
    transactionSuccess = (data) => {

        let auth=this.props.user.userData.isAuth;

        console.log('checkout: transactionsuccess: auth=',auth);

        let userEmail=!auth ? 'none' : this.props.user.userData.email;

        console.log('checkout: transactionsuccess: userEmail=',userEmail);

        let userData={
            name: this.state.formdata.name.value,
            lastname: this.state.formdata.lastname.value,
            phone: this.state.formdata.phone.value,
            email: this.state.formdata.email.value,
            address: this.state.formdata.address.value
        }

        this.props.dispatch(onSuccessBuy({ // pass user and payment data
            
            user:userEmail,
            userData,
            shipping:this.state.formdata.shippingCosts.value,
            paymentData: data,
            totalPaid: this.state.grandTotal
        })).then(()=>{
            if(this.props.user.successBuy){ //if all ok update state: remove total and show success message and clear everything else
                this.setState({
                    formSuccess: true
                })
            }
        })//handle the error

        setTimeout(()=>{
            this.props.history.push('/');
        },3000)

        this.setState({
            // showTotal: false,
            formSuccess: true
            // showSuccess: true
        })
    }

    //update state
    updateFields = (newFormdata) => {
        this.setState({
            formdata: newFormdata
        })
    }

    updateForm = (element) => {
        const newFormdata = update(element,this.state.formdata,'checkout');
        console.log("checkout: updateForm: newFormData=",newFormdata);
        this.setState({
            formError: false,
            formdata: newFormdata
        })

        console.log("checkout: updateForm: shiiping cost value=",parseInt(newFormdata.shippingCosts.value,10), " and typeof is",typeof newFormdata.shippingCosts.value);

        let shipping=parseFloat(newFormdata.shippingCosts.value);

        let grandTotal=parseFloat(shipping+this.state.total).toFixed(2);

        this.setState({grandTotal});

        if (isFormValid(newFormdata)){
            this.setState({formIsValid:true})
        }
        
    }

    render() {
        // const formData=this.state.formdata;
        return (
            <div className="page_wrapper">
                {this.state.showSnackBar ?
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
                <div className="container">
                        <div className="register_login_container">
                        <Dialog open={this.state.formSuccess}> {/**show the dialogue or not */}
                            <div className="dialog_alert">
                                <div>THANK YOU!</div>
                                <div>
                                    YOUR ORDER IS NOW COMPLETE!!!
                                    You will be redirected in a couple seconds...
                                </div>
                            </div>
                        </Dialog>
                         {/* { this.state
                            <div className="cart_success">
                                <FontAwesomeIcon icon={faSmile}/>
                                <div>
                                    THANK YOU!
                                </div>
                                <div>
                                    YOUR ORDER IS NOW COMPLETE!!!
                                </div>
                            </div>
                         } */}
                            <div className="left">
                                <h2>Personal information</h2>
                                    <div className="form_block_two">
                                        <div className="block">
                                            <FormField
                                                id={'name'}
                                                formdata={this.state.formdata.name}
                                                change={(element)=> this.updateForm(element)}
                                            />
                                        </div>
                                        <div className="block">
                                            <FormField
                                                id={'lastname'}
                                                formdata={this.state.formdata.lastname}
                                                change={(element)=> this.updateForm(element)}
                                            />
                                        </div>

                                    </div>
                                    <div className="form_block_two">
                                    <div className="block">
                                        <FormField
                                            id={'email'}
                                            formdata={this.state.formdata.email}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                </div>
                                <div className="form_block_two">
                                    <div className="block">
                                    <FormField
                                            id={'phone'}
                                            formdata={this.state.formdata.phone}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                    <div className="block">
                                    <FormField
                                            id={'address'}
                                            formdata={this.state.formdata.address}
                                            change={(element)=> this.updateForm(element)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    { this.state.formError ?
                                        <div className="error_label">
                                            Please check your data
                                        </div>
                                    :null}
                                    
                                </div>
                    </div>
                    <div className="right">
                        <div className="checkout_products">
                            <h1>Products</h1>
                            <RenderProducts 
                                products={this.props.cart.cartDetail}
                                total={this.state.total}
                            />
                        </div>
                        <div className="checkout_products">
                            <h4>Shipping Costs:&nbsp;</h4>
                            <span>
                                <FormField
                                    id={'shippingCosts'}
                                    formdata={this.state.formdata.shippingCosts}
                                    change={(element) => this.updateForm(element)}
                                />
                            </span>
                        </div>
                        <div className="checkout_products">
                            <h2>Grant Total:&nbsp;</h2><span>{this.state.grandTotal}€</span>
                        </div>
                        
                        {
                            this.state.grandTotal>0 && this.state.total>0  && this.state.formIsValid ?
                        
                        <div className="paypal_button_container">
                            <Paypal //paypal button
                                toPay={this.state.grandTotal} //...
                                transactionError={(data)=> this.transactionError(data)} //transaction error
                                transactionCanceled={(data)=> this.transactionCanceled(data)} //what to do when user cancells transaction
                                onSuccess={(data)=> this.transactionSuccess(data)} //all good
                            />
                        </div>
                        :null
                        }
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user, //gets/sets user from/to state app
        cart : state.cart
    }
}

export default connect(mapStateToProps)(Checkout);