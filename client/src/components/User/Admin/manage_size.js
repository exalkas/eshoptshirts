import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserLayout from '../../../hoc/user';
import { getSize, removeSize, addSize } from '../../../actions/products_actions';

import FormField from '../../utils/Form/formfield';
import { generateData, update, resetFields, isFormValid } from '../../utils/Form/formActions';

class ManageSize extends Component {
    state={
        loading:true,
        formError:false,
        formSuccess:false,
        formdata:{
            name: {
                element: 'input',
                value: '',
                config:{
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter the Size name',
                    label: 'Size'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
        },
        rows:{}
    }

    async componentDidMount(){
        await this.props.dispatch(getSize()); // get Size fom DB

        this.setState({
            loading:false,
            rows:{...this.props.products.size}
        })
    }

    async removeItem(id){

        let size={_id:id};
        
        await this.props.dispatch(removeSize(size))
            .then(response => {
                console.log('MANAGE_SIZE: removeitem: RESPONSE=',response);
                if (response.payload.status===200){
                    console.log('MANAGE_SIZE: removeitem: success');
                    this.setState({
                        rows:{...this.props.products.size}
                    });
                } else {
                    console.log('MANAGE_SIZE: removeitem: NOT success');
                }
            });

    }

    // Renders Size 
    renderSize = () => {

        const objKeys=Object.keys(this.state.rows);

        console.log('RENDERSIZE: objkeys=',objKeys);
        console.log('renderSize: this.state.rows=',this.state.rows);

        let size= Object.keys(this.state.rows).map(key => {
            return this.state.rows[key];
        })

        console.log('MANAGE_SIZE: renderSize: size=',size);

        return (
                <div>
                    {size ? size.map(item => 
                        <div key={item._id}>
                            <div className="category_item">
                                <div>{item.name}</div>
                            </div>
                            <div className="item btn">
                                    <div className="cart_remove_btn" //remove button. product is in the loop
                                        onClick={()=> this.removeItem(item._id)}> 
                                        Remove
                                    </div>
                            </div>
                        </div>
                    )
                    :null}
                </div>
        )
    }

    updateForm = (element) => {
        const newFormdata = update(element,this.state.formdata,'size');
        this.setState({
            formError: false,
            formdata: newFormdata
        });
    }

    resetFieldsHandler = () =>{
        const newFormData = resetFields(this.state.formdata,'size');

        this.setState({
            formdata: newFormData,
            formSuccess:true
        });
    }

  
    submitForm= (event) =>{
        event.preventDefault();
        
        let dataToSubmit = generateData(this.state.formdata,'size');
        let formIsValid = isFormValid(this.state.formdata,'size')
        let existingSize = this.props.products.size;


        console.log('MANAGE_SIZE: datatoSubmit=',dataToSubmit);
        console.log('MANAGE_SIZE: formIsValid=',formIsValid);
        console.log('MANAGE_SIZE: existingSize=',existingSize);

        if(formIsValid){
           this.props.dispatch(addSize(dataToSubmit,existingSize)).then(response=>{
               console.log('MANAGE_SIZE: addSize: response=',response);

                if(response.payload.success){
                    console.log('MANAGE_SIZE: sucess in addSize!');
                    this.resetFieldsHandler();
                    this.setState({
                        rows:{...this.props.products.size}
                    });
                }else{
                    console.log('MANAGE_SIZE: error in addSize!');
                    this.setState({formError:true})
                }
           })
        } else {
            this.setState({
                formError: true
            })
        }
    }


    render() {
        return (
            <UserLayout>
                <div className="admin_category_wrapper">
                    <h1>Size</h1>
                    <div className="admin_two_column">
                        <div className="left">
                            <div className="brands_container">
                                {this.renderSize()}
                            </div>
                        </div>
                        <div className="right">
                            
                        <form onSubmit={(event)=> this.submitForm(event)}>

                            <FormField
                                id={'name'}
                                formdata={this.state.formdata.name}
                                change={(element) => this.updateForm(element)}
                            />


                            {this.state.formError ?
                                <div className="error_label">
                                    Please check your data
                                </div>
                                : null}
                            <button onClick={(event) => this.submitForm(event)}>
                                Add Size
                            </button>

                        </form>

                        </div>

                    </div>
                </div>
            </UserLayout>
        );
        
    }
}


const mapStateToProps= (state) => {
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(ManageSize);