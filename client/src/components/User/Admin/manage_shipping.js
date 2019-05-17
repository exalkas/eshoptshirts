import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserLayout from '../../../hoc/user';

import { getShipping, addShipping, removeShipping} from '../../../actions/shipping_actions';

import FormField from '../../utils/Form/formfield';
import { generateData, update, resetFields, isFormValid } from '../../utils/Form/formActions';

import Pagination from '../../utils/pagination';

class ManageShipping extends Component {

    state={
        loading:true,
        formError:false,
        formSuccess:false,
        formdata:{
            shipping_type: {
                element: 'input',
                value: '',
                config:{
                    name: 'shipping_type_input',
                    type: 'text',
                    placeholder: 'Enter the Shipping name',
                    label: 'Shipping name'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            shipping_cost: {
                element: 'input',
                value: '',
                config:{
                    name: 'shipping_cost_input',
                    type: 'number',
                    placeholder: 'Enter Shipping cost',
                    label: 'Shipping Cost'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel:true
            },
            shipping_region_id: {
                element: 'input',
                value: '',
                config:{
                    name: 'shipping_region_id_input',
                    type: 'number',
                    placeholder: 'Enter Shipping Region',
                    label: 'Shipping Region'
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
        rows:[],
        currentPage:1,
        recordsCount:0,
        skip:0,
        fetch:4,
        maxNumberOfButtons:3
    }

    async componentDidMount(){

        const filter={
            skip: this.state.skip,
            fetch: this.state.fetch
        }

        this.fetchRows(filter);

    }


    async fetchRows(filter){
        await this.props.dispatch(getShipping(filter))
        .then(response => {
            console.log('MANAGE SHIPPING: mount: RESPONSE.payload=',response.payload);

            this.setState({
                rows: [...response.payload.shipping],
                recordsCount: response.payload.shippingsCount
            })
        })
        console.log('MANAGE SHIPPING: mount: STATE=',this.props.shipping);
    }

    async removeItem(id){

        const shipping={ // prepare format for server and send skip and fetch settings as well
            _id:id,
            skip: this.state.skip,
            fetch: this.state.fetch
        }; 

        await this.props.dispatch(removeShipping(shipping))
        .then(response => {
            console.log('MANAGE_SHIPPING: removeitem: RESPONSE=',response);
            if (response.payload.status===200){
                console.log('MANAGE_SHIPPING: removeitem: success');
                this.setState({
                    rows:[...response.payload.shipping]
                });
                this.handlePageChange(this.state.currentPage);
            } else {
                console.log('MANAGE_SHIPPING: removeitem: NOT success');
            }
        })
    }

    renderShippings(){
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Region</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rows.length > 0 ? 
                            this.state.rows.map(item => (
                                <tr key={item._id}>
                                    <td>{item.shipping_type}</td>
                                    <td>{item.shipping_region_id}</td>
                                    <td>{item.shipping_cost}</td>
                                    <td>
                                        <div className="item btn">
                                            <div className="cart_remove_btn" //remove button. product is in the loop
                                                    onClick={()=> this.removeItem(item._id)}> 
                                                    Remove
                                            </div>
                                        </div>
                                    </td>
                                </tr>    
                            ))
                        :null}
                    </tbody>
                </table>
            </div>
        )
    }

    // Handles page change for pagination component
    handlePageChange(e) {

        console.log("MANAGE SHIPPING: handlePageChange: e=", e);

        const fetch = this.state.fetch; // to do less typing and calculations
        const records = this.state.recordsCount; // less typing and calculations

        let currentPage = this.state.currentPage; 
        let lastPage=Math.ceil(this.state.recordsCount/fetch); //as the name implies. needed in many cases
        let skip = 0; // rows to skip
        
        // console.log(`handlePageChange: e=`,e);

        if (e==='first' || e==='next' || e==='prev' || e==='last' ) { // check if buttons first, last etc is pressed
            console.log('e is LETTERS ')
            switch (e) {
                case 'first':
                    console.log('CASE FIRST')
                    currentPage=1;
                    skip=0;
                    break;
                case 'prev':
                    console.log('CASE PREV')
                    if (currentPage===1) { 
                        currentPage=1;
                        skip=0;
                    } else {
                        currentPage--;
                        skip=(currentPage-1)*fetch;
                    }
                    break;
                case 'next':
                    console.log('CASE NEXT')
                    if (currentPage===lastPage) {
                        currentPage=lastPage;
                        skip= records-fetch;
                    } else {
                        currentPage++;
                        skip = (currentPage-1)*fetch;
                    }
                    break;
                case 'last':
                    console.log('CASE LAST')
                    currentPage=lastPage;
                    skip=records-fetch;
                    break;
                default: 
                    console.log('CASE DEFAULT')
                    skip=0;
                    currentPage=1;
            }
        } else {
            console.log('BUTTON VALUE IS ',e);
            skip= (e-1)* fetch;
            currentPage = e;
        }

        console.log('MANAGE SHIPPING: skip=', skip, ' currentPage=',currentPage);

        const filter={
            skip,
            fetch: this.state.fetch
        }

        this.fetchRows(filter);

        this.setState({
            currentPage,
            skip
        });

      }

    //============================
    //  FORM ACTIONS
    //============================

    updateForm = (element) => {
        const newFormdata = update(element,this.state.formdata,'shipping');
        this.setState({
            formError: false,
            formdata: newFormdata
        });
    }
    //============================
    resetFieldsHandler = () =>{
        const newFormData = resetFields(this.state.formdata,'shipping');

        this.setState({
            formdata: newFormData,
            formSuccess:true
        });
    }

    //============================
    submitForm= (event) =>{
        event.preventDefault();
        
        let dataToSubmit = generateData(this.state.formdata,'shipping');
        let formIsValid = isFormValid(this.state.formdata,'shipping')
        let existingShipping = this.props.shipping.shipping;


        console.log('MANAGE_SHIPPING: datatoSubmit=',dataToSubmit);
        console.log('MANAGE_SHIPPING: formIsValid=',formIsValid);
        console.log('MANAGE_SHIPPING: existingShipping=',existingShipping);

        if(formIsValid){
           this.props.dispatch(addShipping(dataToSubmit,existingShipping)).then(response=>{
               console.log('MANAGE_SHIPPING: addShipping: response=',response);

                if(response.payload.success){
                    console.log('MANAGE_SHIPPING: sucess in addShipping!');
                    this.resetFieldsHandler();
                    this.setState({
                        rows:[...this.props.shipping.shipping]
                    });
                    this.handlePageChange(this.state.currentPage);
                }else{
                    console.log('MANAGE_SHIPPING: error in addShipping!');
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
                    <h1>Shipping</h1>
                    <div className="admin_two_column">
                        <div className="right">
                            <form onSubmit={(event)=> this.submitForm(event)}>
                                <FormField
                                    id={'shipping_type'}
                                    formdata={this.state.formdata.shipping_type}
                                    change={(element) => this.updateForm(element)}
                                />
                                <FormField
                                    id={'shipping_cost'}
                                    formdata={this.state.formdata.shipping_cost}
                                    change={(element) => this.updateForm(element)}
                                />

                                <FormField
                                    id={'shipping_region_id'}
                                    formdata={this.state.formdata.shipping_region_id}
                                    change={(element) => this.updateForm(element)}
                                />

                                {this.state.formError ?
                                    <div className="error_label">
                                        Please check your data
                                    </div>
                                    : null}
                                <button onClick={(event) => this.submitForm(event)}>
                                    Add Shipping
                                </button>
                            </form>
                        </div>
                    </div>
                    <div >
                        <div >
                            these are the shippings
                            {this.renderShippings()}
                        </div>
                    </div>
                    <Pagination 
                        recordCount={this.state.recordsCount}
                        currentPage={this.state.currentPage}
                        maxNumberOfButtons={this.state.maxNumberOfButtons}
                        recordstoShow={this.state.fetch}
                        handlePaginationClick={(e) => this.handlePageChange(e)}
                    />
                </div>
            </UserLayout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        shipping : state.shipping
    }
}

export default connect(mapStateToProps)(ManageShipping);