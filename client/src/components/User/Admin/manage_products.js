/**
 * CRUD For products
 */
import React, { Component } from 'react';
import UserLayout from '../../../hoc/user';

import FormField from '../../utils/Form/formfield';
import { update, generateData, isFormValid, populateOptionFields,resetFields} from '../../utils/Form/formActions';
import FileUpload from '../../utils/Form/fileupload';

import { connect } from 'react-redux';
import { getCategories, getDepartments,addProduct, clearProduct, getAllProducts, getColors, getSize, removeProduct, updateProduct } from '../../../actions/products_actions';

import ProductsTable from '../../utils/productsTable';
import Pagination from '../../utils/pagination';

import CheckboxGroup from '../../utils/checkboxGroup';
import Search from '../../Search/search';

class ManageProducts extends Component {

    state = {
        formError:false,
        formSuccess:false,
        formdata:{
            name: {
                element: 'input',
                value: '',
                config:{
                    label: 'Product name',
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter product name'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            description: {
                element: 'textarea',
                value: '',
                config:{
                    label: 'Product description',
                    name: 'description_input',
                    type: 'text',
                    placeholder: 'Enter product description'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            price: {
                element: 'input',
                value: 0,
                config:{
                    label: 'Product price',
                    name: 'price_input',
                    type: 'number',
                    placeholder: 'Enter price'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            discounted_price: {
                element: 'input',
                value: 0,
                config:{
                    label: 'Product discounted price',
                    name: 'discounte_price_input',
                    type: 'number',
                    placeholder: 'Enter discounted price'
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            category: {
                element: 'select',
                value: '',
                config:{
                    label: 'Product Category',
                    name: 'category_input',
                    options:[]
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            department: {
                element: 'select',
                value: '',
                config:{
                    label: 'Select department',
                    name: 'department_input',
                    options:[]
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            publish: {
                element: 'select',
                value: '',
                config:{
                    label: 'Publish',
                    name: 'publish_input',
                    options:[
                        {key:true,value:'Public'},
                        {key:false,value:'Hidden'},
                    ]
                },
                validation:{
                    required: true
                },
                valid: false,
                touched: false,
                validationMessage:'',
                showlabel: true
            },
            images:{
                value:[],
                validation:{
                    required: false
                },
                valid: true,
                touched: false,
                validationMessage:'',
                showlabel: false
            }
        },
        limit: 10,
        skip: 0,
        filter: {name:''},
        products: [],
        currentPage: 1,
        recordsCount: 0,
        maxNumberOfButtons:3,
        checkedColors:[],
        checkedSize:[],
        productToUpdate:''
    }

    //fetch necessary records from db
    async componentDidMount(){

        const formdata = this.state.formdata;

        await this.props.dispatch(getCategories()).then( response => {
            const newFormData = populateOptionFields(formdata,this.props.products.categories,'category'); //brands
            this.updateFields(newFormData) //update state
        })

        await this.props.dispatch(getDepartments()).then( response => {
            const newFormData = populateOptionFields(formdata,this.props.products.departments,'department'); //wood
            this.updateFields(newFormData)
        })

        await this.props.dispatch(getColors()).then(response => { //Fetches colors and updates state
            
            console.log("MANAGE PRODUCTS: MOUNT: getColors response=",response);
            
            if (response.payload) { // state update
                
                const checkedColors= this.helperKeyValue(response.payload);

                this.setState({
                    checkedColors
                })
            }
        });

        await this.props.dispatch(getSize()).then(response => { //Fetches size and updates state
            
            console.log("MANAGE PRODUCTS: MOUNT: getSize response=",response);
            
            if (response.payload) { // state update
                
                const checkedSize= this.helperKeyValue(response.payload);
            
                this.setState({
                    checkedSize
                })
            }
        });

        this.loadProducts(this.state.skip, this.state.limit, this.state.filter);

        this.helperFormatArray(this.state.checkedColors);
    }

    /**
     *  Gets products from server
     */
    async loadProducts(skip, limit, filter){
        await this.props.dispatch(getAllProducts(skip, limit, filter, true))
        .then( response => {
            
            console.log('MANAGE PRODUCTS: LOADPRODUCTS: response=',response);
            console.log('MANAGE PRODUCTS: LOADPRODUCTS: state=',this.props.products);
            
                const products= this.helperBuildProducts(response.payload.products);
                
                // response.payload.products.forEach(element => {
                //     products.push({
                //         ...element,
                //         categoryName: this.props.products.categories.find(item => item._id===element.category).name,
                //         departmentName: this.props.products.departments.find(item => item._id===element.department).name
                //     });    
                // });
                

            this.setState({products,
                recordsCount: response.payload.recordsCount
            })
        });
    }

helperBuildProducts(someArray){
    let products=[];

    if (someArray.length > 0) {
        someArray.forEach(element => {
            products.push({
                ...element,
                categoryName: this.props.products.categories.find(item => item._id===element.category).name,
                departmentName: this.props.products.departments.find(item => item._id===element.department).name
            });    
        });
    }

    return products
}

    /**
     * Helper function to help update state
     * Gets an array and returns a new one
     * with key-value pairs set to false
     */
    helperKeyValue(payload){
        let tmpArray=[];

            payload.forEach((item) => {
                // console.log("helperKeyValue: item=",item);
                tmpArray[item.name]=false; 
            })

        return tmpArray;
    }

    /**
     * 
     * Helper to return array where value is true
     * accepts an array and search in state in predefined 
     */
    helperFormatArray(someArray, searchArray){
        console.log("MANAGE PRODUCTS: helperFormatArray: someArray=",someArray);

        let newArray=[];

        for(let item in someArray) {
            // console.log("helperFormatArray for each item=",item)
            // console.log("helperFormatArray for each item=",someArray[item])
            if (someArray[item]===true) {
                
                if (searchArray==='colors') {
                    newArray.push(this.props.products.colors.find(element => element.name===item)._id);
                } else {
                    newArray.push(this.props.products.size.find(element => element.name===item)._id);
                }
            }
        }

        console.log("MANAGE PRODUCTS: helperFormatArray: newArray=",newArray);
        return newArray;
    }

    // Sets value to false to colors and size state arrays with key value pairs
    helperResetColorAndSize(){
        let colors=this.state.checkedColors;
        let size= this.state.checkedSize;
        let key='';

        for (key in colors){
            colors[key]=false;
        }

        for (key in size){
            size[key]=false;
        }

        this.setState({
            checkedColors: colors,
            checkedSize: size
        });
    }

    // Handles page change for pagination component
    handlePageChange(e) {

        console.log("MANAGE SHIPPING: handlePageChange: e=", e);

        const fetch = this.state.limit; // to do less typing and calculations
        const records = this.state.recordsCount; // less typing and calculations

        let currentPage = this.state.currentPage; 
        let lastPage=Math.ceil(records/fetch); //as the name implies. needed in many cases
        let skip = 0; // rows to skip
        
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

        this.loadProducts(skip, this.state.limit, this.state.filter);

        this.setState({
            skip,
            currentPage
        });
      }

    handleSearch(e){
        this.setState({filter: {name:e.target.value}});
        console.log('MANAGE PRODUCTS: handleSearch: E=',e.target.value);
    }

    handleSearchClick(){
        this.loadProducts(0,this.state.limit,this.state.filter);
    }

   //gets am image
   imagesHandler = (images) => {
        const newFormData = {
            ...this.state.formdata
        }
        newFormData['images'].value = images;
        newFormData['images'].valid = true;

        this.setState({
            formdata:  newFormData
        })
    }

    // Updates colors state
    handleColorChange(e) {

        if (e) {
            const currentState=this.state.checkedColors[e]

            let checkedColors=this.state.checkedColors;
            
            checkedColors[e]=!currentState;
            this.setState({ checkedColors });
        }
        
        console.log('MANAGE PRODUCTS: handleColorChange: checkedColors=',this.state.checkedColors);
    };

    // Updates colors state
    handleSizeChange(e) {

        if (e) {
            const currentState=this.state.checkedSize[e]

            let checkedSize=this.state.checkedSize;
            
            checkedSize[e]=!currentState;
            this.setState({ checkedSize });
        }

        console.log('MANAGE PRODUCTS: handleSizeChange: checkedSize=',this.state.checkedSize);
    };

    async handleRemove(id){
        const product={
            _id: id,
            skip: this.state.skip,
            limit: this.state.limit,
            filter: this.state.filter
        }

        console.log("HANDLE REMOVE: product=",product);

        await this.props.dispatch(removeProduct(product))
        .then(response => {
            console.log('MANAGE_PRODUCTS: handleRemove: RESPONSE=',response);
            if (response.payload.status===200){
                console.log('MANAGE_PRODUCTS: removeitem: success');
                this.setState({
                    products:[...response.payload.products]
                });
                this.handlePageChange(this.state.currentPage);
            } else {
                console.log('MANAGE_PRODUCTS: handleRemove: NOT success');
            }
        });
    }

    handleUpdateFields(product){

        let newFormData={...this.state.formdata}
        this.helperResetColorAndSize(); // sets colors and size to false;
        let colors=[...this.state.checkedColors];
        let size=[...this.state.checkedSize]

        let key='';

        if (product.colors[0]!=='White') { // to avoid crushing from old data
            product.colors.forEach(item => {
                // 1. find key from value
                key= this.props.products.colors.find(element => element._id===item).name || '';
                // 2. update state array
                if (key) colors[key]=true;
            })
        }

        if (product.size[0]!=='S') { // to avoid crushing from old data
            product.size.forEach(item => {
                key= this.props.products.size.find(element => element._id===item).name;
                size[key]=true;
            })
        }    

        newFormData['images'].value = product.images;
        newFormData['images'].valid = true;
        newFormData["name"].value=product.name;
        newFormData["name"].valid=true;
        newFormData["description"].value=product.description;
        newFormData["description"].valid=true;
        newFormData["price"].value=product.price;
        newFormData["price"].valid=true;
        newFormData["discounted_price"].value=product.discounted_price;
        newFormData["discounted_price"].valid=true;
        newFormData["category"].value=product.category;
        newFormData["category"].valid=true;
        newFormData["department"].value=product.department;
        newFormData["department"].valid=true;
        newFormData["publish"].value=product.publish;
        newFormData["publish"].valid=true;

        console.log("handleUpdateFields: newFormData:",newFormData);

        this.setState({
            productToUpdate: product._id,
            formdata: newFormData,
            checkedColors: colors,
            checkedSize: size
        });

        console.log("handleUpdateFields: state.checkedColors:",this.state);
    }

    /*******************************************************
     * FORM FUNCTIONS
     ******************************************************/
    //update state
    updateFields = (newFormdata) => {
        this.setState({
            formdata: newFormdata
        })
    }

    updateForm = (element) => {
        const newFormdata = update(element,this.state.formdata,'products');
        this.setState({
            formError: false,
            formdata: newFormdata
        })
    }

    //reset fields after successfull form submit
    resetFieldHandler = (cancel) => {
        const newFormData = resetFields(this.state.formdata,'products'); //

        if (cancel) {
            this.setState({
                productToUpdate:''
            });
        } else {
            this.setState({
                formdata: newFormData,
                formSuccess:true
            });
            setTimeout(()=>{ //show message after 3 sec
                this.setState({
                    formSuccess: false
                },()=>{
                    this.props.dispatch(clearProduct()) //clear product from app state
                })
            },3000)
        }
        
        this.helperResetColorAndSize(); // reset colors and size as well
    }

    async submitForm (event, update) {

        event.preventDefault();
        
        let dataToSubmit = generateData(this.state.formdata,'products');
        let formIsValid = isFormValid(this.state.formdata,'products');
        let existingProducts = this.props.products.toShop;

        let colors=this.helperFormatArray(this.state.checkedColors, "colors"); //get colors ready
        let size=this.helperFormatArray(this.state.checkedSize, "size"); //get size ready
        
        dataToSubmit= {...dataToSubmit, colors ,size}; // append colors and size

        if(formIsValid){
            if (update) { // If should update
                dataToSubmit={...dataToSubmit, 
                    _id:this.state.productToUpdate, 
                    skip: this.state.skip, 
                    limit: this.state.limit, 
                    filter:this.state.filter};

                console.log("MANAGE PRODUCTS: SUBMIT FORM: dataToSubmnit BEFORE UPDATE=",dataToSubmit);
                await this.props.dispatch(updateProduct(dataToSubmit))
                    .then(response => {
                        console.log('MANAGE_PRODUCTS: SUBMIT FORM: RESPONSE=',response);
                        if (response.payload.status===200){
                            console.log('MANAGE_PRODUCTS: SUBMIT FORM: success');
                            this.resetFieldHandler(true); // reset fields after success
                            this.setState({
                                products:[...response.payload.products]
                            });
                            this.handlePageChange(this.state.currentPage);
                        } else {
                            console.log('MANAGE_PRODUCTS: SUBMIT FORM: NOT success');
                        }
                })
            } else { // else add product
                console.log("MANAGE PRODUCTS: SUBMIT FORM: dataToSubmnit BEFORE ADD=",dataToSubmit);
                await this.props.dispatch(addProduct(dataToSubmit, existingProducts)).then(()=>{
                    if( this.props.products.addProduct.success){
                        this.resetFieldHandler(false); // reset fields after success
                        
                        const products= this.helperBuildProducts(this.props.products.toShop);

                        this.setState({
                            products
                        });
                        this.handlePageChange(this.state.currentPage);

                    }else{
                        this.setState({formError: true})
                    }
                })
            }
        } else { //Form is not valid
            this.setState({
                formError: true
            })
        }
    }

    render() {
        return (
            <UserLayout>
                <div>
                    <h1>Products</h1>
                    <Search
                        handleSearch={(e) => this.handleSearch(e)}
                        value={this.state.filter.name}
                        onClick={() => this.handleSearchClick()}
                    />
                    <div className="form_divider"></div>
                    <ProductsTable
                        products={this.state.products}
                        handleRemove={(e) => this.handleRemove(e)}
                        handleUpdate={(e) => this.handleUpdateFields(e)}
                    />
                    <div className='manageproducts-pagination'>
                    <Pagination
                        recordCount={this.state.recordsCount}
                        currentPage={this.state.currentPage}
                        maxNumberOfButtons={this.state.maxNumberOfButtons}
                        recordstoShow={this.state.limit}
                        handlePaginationClick={(e) => this.handlePageChange(e)}
                        handleRemove={(e) => this.handleRemove(e)}
                    />
                    </div>
                    <div className="form_divider"></div>

                    <h1>{this.state.productToUpdate===''? "Add product" :"Update product"}</h1>
                    
                    <form onSubmit={(event)=> this.submitForm(event)}>

                        <FileUpload
                            imagesHandler={(images)=> this.imagesHandler(images)}
                            reset={this.state.formSuccess}
                            images={this.state.formdata.images.value}
                        />

                        <FormField
                            id={'name'}
                            formdata={this.state.formdata.name}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'description'}
                            formdata={this.state.formdata.description}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'price'}
                            formdata={this.state.formdata.price}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'discounted_price'}
                            formdata={this.state.formdata.discounted_price}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="form_divider"></div>

                        <FormField
                            id={'category'}
                            formdata={this.state.formdata.category}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'department'}
                            formdata={this.state.formdata.department}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="form_divider"></div>
                        
                        <div>Select Colors</div>

                        <CheckboxGroup 
                            items={this.props.products.colors}
                            onChange={(e) => this.handleColorChange(e)}
                            value={this.state.checkedColors}
                        />
                        
                        <div className="form_divider"></div>

                        <div>Select Size</div>
                        
                        <CheckboxGroup 
                            items={this.props.products.size}
                            onChange={(e) => this.handleSizeChange(e)}
                            value={this.state.checkedSize}
                        />

                        <div className="form_divider"></div>

                        <FormField
                            id={'publish'}
                            formdata={this.state.formdata.publish}
                            change={(element) => this.updateForm(element)}
                        />

                        {this.state.formSuccess ?
                            <div className="form_success">
                                Success
                            </div>
                        :null}

                        {this.state.formError ?
                            <div className="error_label">
                                Please check your data
                                        </div>
                            : null}
                        {this.state.productToUpdate==='' ? 
                        <button onClick={(event) => this.submitForm(event, false)}>
                            Add product                        
                        </button>
                        : 
                        <div className="group-buttons">
                            <button onClick={(e) => this.submitForm(e, true)}>Update Product</button> 
                            <button onClick={() => this.resetFieldHandler(true)}>Cancel</button>
                        </div> }
                    </form>
                </div>
            </UserLayout>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products
    }
}


export default connect(mapStateToProps)(ManageProducts);