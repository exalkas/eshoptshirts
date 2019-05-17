import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserLayout from '../../../hoc/user';
import { getColors, removeColor, addColor } from '../../../actions/products_actions';

import FormField from '../../utils/Form/formfield';
import { generateData, update, resetFields, isFormValid } from '../../utils/Form/formActions';

class ManageColors extends Component {

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
                    placeholder: 'Enter the color name',
                    label: 'Color'
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
        console.log('ManageColors: componentDidMount: started');

        await this.props.dispatch(getColors());

        this.setState({
            loading:false,
            rows:{...this.props.products.colors}
        });
        // console.log('ManageColors: componentDidMount: colors=',this.props.colors);
    }

    async removeItem(id){

        console.log('removeColor: id=',id);

        let color={_id:id};
        
        await this.props.dispatch(removeColor(color))
            .then(response => {
                console.log('manage_colors: removeitem: RESPONSE=',response);
                if (response.payload.status===200){
                    console.log('manage_colors: removeitem: success');
                    this.setState({
                        rows:{...this.props.products.colors}
                    });
                } else {
                    console.log('manage_colors: removeitem: NOT success');
                }
            });
            
    }

    // Renders Colors 
    renderColors = () => {

        const objKeys=Object.keys(this.state.rows);

        console.log('RENDERCOLORS: objkeys=',objKeys);
        console.log('renderColors: this.state.rows=',this.state.rows);

        let colors= Object.keys(this.state.rows).map(key => {
            // console.log('renderColors: LOOP this.state.rows[key]=',this.state.rows[key]);
            return this.state.rows[key];
        })

        console.log('manage_colors: rendercolors: colors=',colors);

        return (
                <div>
                    {colors ? colors.map(item => 
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
        const newFormdata = update(element,this.state.formdata,'colors');
        this.setState({
            formError: false,
            formdata: newFormdata
        });
    }

    resetFieldsHandler = () =>{
        const newFormData = resetFields(this.state.formdata,'colors');

        this.setState({
            formdata: newFormData,
            formSuccess:true
        });
    }

  
    submitForm= (event) =>{
        event.preventDefault();
        
        let dataToSubmit = generateData(this.state.formdata,'colors');
        let formIsValid = isFormValid(this.state.formdata,'colors')
        let existingColors = this.props.products.colors;


        console.log('manage_color: datatoSubmit=',dataToSubmit);
        console.log('manage_color: formIsValid=',formIsValid);
        console.log('manage_color: existingColors=',existingColors);

        if(formIsValid){
           this.props.dispatch(addColor(dataToSubmit,existingColors)).then(response=>{
               console.log('manage_colors: addColor: response=',response);

                if(response.payload.success){
                    console.log('manage_colors: sucess in addcolor!');
                    this.resetFieldsHandler();
                    this.setState({
                        rows:{...this.props.products.colors}
                    });
                }else{
                    console.log('manage_colors: error in addcolor!');
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
                {console.log('manageColors: RENDER about to start!')}
                <div className="admin_category_wrapper">
                    <h1>Colors</h1>
                    <div className="admin_two_column">
                        <div className="left">
                            <div className="brands_container">
                                {this.renderColors()}
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
                                Add Color
                            </button>

                        </form>

                        </div>

                    </div>
                </div>
            </UserLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products : state.products
    }
}

export default connect(mapStateToProps)(ManageColors);