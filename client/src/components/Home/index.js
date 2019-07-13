import React, { Component } from 'react';
// import PageTop from '../utils/page_top'; //Could be used for breadcrubs

import HomePromotion from './home_promotion';
import HomeSlider from './home_slider';

import { price } from '../utils/Form/fixed_categories';//just fixed values

import { connect } from 'react-redux';
import { getProductsToShop ,getProductsBestSelling,getProductsNewest, getCategories, getDepartments, getColors, getSize } from '../../actions/products_actions';
import { getCart } from '../../actions/cart_actions';

import CollapseCheckbox from '../utils/collapseCheckbox';
import CollapseRadio from '../utils/collapseRadio';

import Search from '../../components/Search/search';
import LoadmoreCards from './loadmoreCards';
import CardBlock from '../utils/card_block';

//Grid icons
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faTh from '@fortawesome/fontawesome-free-solid/faTh';

class Shop extends Component {

    state = {
        grid:'',
        limit:6,
        skip:0,
        filters:{
            categories:[],
            departments:[],
            price:[],
            name:''
        },
        filterOn: 0
    }

    // Fetch brands, woods and products from DB
    componentDidMount(){
        this.props.dispatch(getDepartments());
        this.props.dispatch(getCategories());
        this.props.dispatch(getColors());
        this.props.dispatch(getSize());

        this.loadProducts();

        this.props.dispatch(getProductsBestSelling());
        this.props.dispatch(getProductsNewest());

        this.props.dispatch(getCart());
    }

    loadProducts(){
        this.props.dispatch(getProductsToShop(
            this.state.skip,
            this.state.limit,
            this.state.filters,
            false
        ));
    }

    //Returns an array which contains the selected values
    handlePrice = (value) => {
        const data = price; //price comes from the fixed values module. so store it in a const to don't mutate it
        let array = []; //will be used to store the selected array of prices

        for(let key in data){//Loop through prices
            if(data[key]._id === parseInt(value,10)){//if price id equals to price that is passed in which is a string and this is why it has to be transformed to int
                array = data[key].array //update the array that contains the selected values
            }
        }
        return array;
    }


    //sets up the filters. it's called from the collapseCheckbox component as CB
    handleFilters = (filters,category) => {
       const newFilters = {...this.state.filters}//copy state to don't mutate it
       newFilters[category] = filters;//copy the passed filters to the state

        if(category === "price"){ //if it'a radio button
            let priceValues = this.handlePrice(filters);
            newFilters[category] = priceValues
        }

       this.showFilteredResults(newFilters) //pass new state
       this.setState({ //update the state from the copy
           filters: newFilters
       })
    }

    //renders products
    showFilteredResults = (filters) =>{
        this.props.dispatch(getProductsToShop(
            0, //when you filter sth you start from scratch 
            this.state.limit,
            filters
        )).then(()=>{
            this.setState({
                skip:0
            })
        })
    }

    //fetches more records from db
    loadMoreCards = () => {
        let skip = this.state.skip + this.state.limit; //increase skip accordingly

        this.props.dispatch(getProductsToShop(
            skip,
            this.state.limit,
            this.state.filters,
            this.props.products.toShop //also send these products to the actions so it will merge them with the new ones that will come
        )).then(()=>{
            this.setState({
                skip  //update skip (skip:skip)
            })
        })
    }

    handleGrid= () =>{
        this.setState({
            grid: !this.state.grid ? 'grid_bars':''
        })
    }

    handleSearch(e){
        this.setState({filters: {name:e.target.value}});
        console.log('HOME: handleSearch: E=',e.target.value);
        console.log('HOME: handleSearch: state.filters=',this.state.filters.name);
    }

    handleSearchClick(){
        this.loadProducts();
        // this.loadMoreCards();
        this.setState({
            filterOn:1
        })

        console.log('HOME: handleSearchClick: CLICKED, state=',this.state);
    }

    render() {
        const products = this.props.products;
        return (
             
            <div>
                {console.log('HOME RENDER: filterOn is', this.state.filterOn)}
                {/* <PageTop
                    title="Browse Products"
                /> */}
                  {this.state.filterOn===1 ? null  :
                  <div>
                      {console.log('HOME RENDER: FROM INSIDE filterOn is', this.state.filterOn)}
                    <HomeSlider />
                    <CardBlock
                        list={products.bestSelling}
                        title="Best Selling T- Shirts"
                    />
                    {/* {console.log("index: best selling products.bestselling=",products.bestSelling)} */}
                    <HomePromotion 
                    image="/images/sport_1200.jpg"
                    lineOne='Up to 40% off'
                    lineTwo='In European T-Shirts'
                    linkTitle='Shop now'
                    linkTo ='/'
                    />
                    <CardBlock
                        list={products.newestProducts}
                        title="New arrivals"
                    />
                    <HomePromotion image="/images/t-shirts_1200.jpg"
                    lineOne='Huge Collection'
                    lineTwo='of custom T-Shirts'
                    linkTitle='Shop now'
                    linkTo ='/'
                    />
                    </div>
                }
                <div className="container">
                    <div className="shop_wrapper">
                        <div className="left">
                            <Search
                                handleSearch={(e) => this.handleSearch(e)}
                                value={this.state.filters.name}
                                onClick={() => this.handleSearchClick()}
                            />
                            <CollapseCheckbox
                                initState={true} //start always true. only for the categories filter. other are false
                                title="Categories"
                                list={products.categories} //pass what we got from the app state
                                handleFilters={(filters)=> this.handleFilters(filters,'category')}// we pass which filters are on and 'category' to distinguish who is calling
                            />
                            <CollapseCheckbox //similar to categories
                                initState={false}
                                title="Departments"
                                list={products.departments}
                                handleFilters={(filters)=> this.handleFilters(filters,'department')}
                            />
                             <CollapseRadio
                                initState={true}
                                title="Price"
                                list={price} //they are fixed values coming from another module
                                handleFilters={(filters)=> this.handleFilters(filters,'price')}
                            />
                           
                        </div>
                        <div className="right">
                            <div className="shop_options">
                                <div className="shop_grids clear">
                                    <div
                                        className={`grid_btn ${this.state.grid?'':'active'}`} //grey button or not
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faTh}/>
                                    </div>
                                    <div
                                        className={`grid_btn ${!this.state.grid?'':'active'}`}
                                        onClick={()=> this.handleGrid()}
                                    >
                                        <FontAwesomeIcon icon={faBars}/>
                                    </div>
                                </div>
                            </div>
                            <div className="shop_products">
                                <LoadmoreCards
                                    grid={this.state.grid} //send grid
                                    limit={this.state.limit} 
                                    size={products.toShopSize}
                                    products={products.toShop}
                                    loadMore={()=> this.loadMoreCards()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        products: state.products,
        cart: state.cart
    }
}

export default connect(mapStateToProps)(Shop);