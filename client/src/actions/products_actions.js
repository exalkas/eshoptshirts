/**
 * products related actions
 */
import axios from 'axios';
import {
    GET_PRODUCTS_NEWEST,
    GET_PRODUCTS_BEST_SELLING,
    GET_CATEGORIES,
    ADD_CATEGORY,
    GET_DEPARTMENTS,
    ADD_DEPARTMENT,
    GET_PRODUCTS_TO_SHOP,
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    UPDATE_PRODUCT,
    CLEAR_PRODUCT,
    GET_PRODUCT_DETAIL,
    CLEAR_PRODUCT_DETAIL,
    GET_COLORS,
    ADD_COLOR,
    REMOVE_COLOR,
    GET_SIZE,
    ADD_SIZE,
    REMOVE_SIZE
} from './types';

import { PRODUCT_SERVER, COLORS_SERVER, SIZE_SERVER } from '../components/utils/servers';

////////////////////////////////////
//////        PRODUCTS
////////////////////////////////////

//Gets products details from db provided its id
export function getProductDetail(id){

    const request = axios.get(`${PRODUCT_SERVER}/byid?id=${id}&type=single`)
    .then(response=>{
        return response.data[0]
    }).catch((error) => console.log("Action getProductDetail Error:",error));

    return {
        type: GET_PRODUCT_DETAIL,
        payload: request
    }

}

//Clears state from previous product detail
export function clearProductDetail(){
    return {
        type: CLEAR_PRODUCT_DETAIL,
        payload:''
    }
}

//Get best selling products
export function getProductsBestSelling(){
    //from the server for reference: ?sortBy=sold&order=desc&limit=100
    const request = axios.get(`${PRODUCT_SERVER}/filtered?sortBy=sold&order=desc&limit=4`)
                    .then(response => response.data)
                    .catch((error)=> console.log("Get Best selling products: Error found:",error));

    return {
        type: GET_PRODUCTS_BEST_SELLING,
        payload: request
    }

}

//Get newest products
export function getProductsNewest(){
    const request = axios.get(`${PRODUCT_SERVER}/filtered?sortBy=createdAt&order=asc&limit=4`)
    .then(response => response.data)
    .catch((error)=> console.log("Get newest products: Error found:",error));

    return {
        type: GET_PRODUCTS_NEWEST,
        payload: request
    }
}

//Get all products for the home page gets 3 parameters and the state from Shop
export function getProductsToShop(skip, limit,filters =[], previousState = [], admin){
    const data = { //to avoid mutation
        limit,
        skip,
        filters,
        admin
    }

    const request = axios.post(`${PRODUCT_SERVER}/all`,data) //pass data to the query
                .then(response => {
                    let newState = [
                        ...previousState, //add products already shown
                        ...response.data.products //more products that we get from db
                    ];
                    return {
                        size: response.data.size,
                        products: newState,
                        recordsCount: response.data.recordsCount
                    }
                });

    return {
        type: GET_PRODUCTS_TO_SHOP,
        payload: request
    }

}


//Get all products for the home page gets 3 parameters and the state from Shop
export function getAllProducts(skip, limit,filters =[]){
    const data = { //to avoid mutation
        limit,
        skip,
        filters
    }

    const request = axios.post(`${PRODUCT_SERVER}/all`,data) //pass data to the query
                .then(response => response.data);

    return {
        type: GET_PRODUCTS_TO_SHOP,
        payload: request
    }
}

// //Gets only one param
export function addProduct(datatoSubmit, existingProducts){

    const request = axios.post(`${PRODUCT_SERVER}/addOne`,datatoSubmit)
                    .then(response => {

                        let products=[];

                        products=[ // merge shipping that comes from server with existing
                            ...existingProducts,
                            response.data.products
                        ];

                        return{
                            success: response.data.success,
                            products
                        }
                    });

    return {
        type: ADD_PRODUCT,
        payload: request
    }
}

//just clears the state. no interaction with db
export function clearProduct(){
    return {
        type: CLEAR_PRODUCT,
        payload: ''
    }
}

export function removeProduct(product){
    const request=axios.post(`${PRODUCT_SERVER}/removeProduct`,product)
    .then(response => {
        console.log('ACTION REMOVE_PRODUCT response=', response);
        return {
            status: response.status,
            products: response.data
        }
    })

    return {
        type: REMOVE_PRODUCT,
        payload:request
    }
}

export function updateProduct(product){
    const request=axios.post(`${PRODUCT_SERVER}/updateProduct`,product)
        .then(response => {
            return {
                status: response.status,
                products: response.data
            }
        })

        return {
            type: UPDATE_PRODUCT,
            payload: request
        }
}

////////////////////////////////////
//////        CATEGORIES
////////////////////////////////////


export function getCategories(){

    const request = axios.get(`${PRODUCT_SERVER}/categories`)
                .then(response => response.data )
                .catch(error=> console.log("Action getCategories error:",error));

    return {
        type: GET_CATEGORIES,
        payload: request
    }

}

// adds a category and merges the new brand with the existing ones
export function addCategory(dataToSubmit, existingBrands){
    const request = axios.post(`${PRODUCT_SERVER}/brand`,dataToSubmit)
    .then(response=>{
        let brands = [//merging
            ...existingBrands,
            response.data.brand
        ];
        return {
            success: response.data.success,
            brands
        }
    });
    return {
        type: ADD_CATEGORY,
        payload: request
    }
}


export function addDepartment(dataToSubmit, existingWoods){
    const request = axios.post(`${PRODUCT_SERVER}/addDepartment`,dataToSubmit)
    .then(response=>{
        let woods = [
            ...existingWoods,
            response.data.wood
        ];
        return {
            success: response.data.success,
            woods
        }
    });
    return {
        type: ADD_DEPARTMENT,
        payload: request
    }
}

export function getDepartments(){
    const request = axios.get(`${PRODUCT_SERVER}/departments`)
    .then(response => response.data )
    .catch(error=> console.log("Action getDepartments error:",error));;

    return {
        type: GET_DEPARTMENTS,
        payload: request
    }
}


//=========================================================
//                       COLORS
//=========================================================
export function getColors(){
    const request = axios.get(`${COLORS_SERVER}/getColors`)
    .then(response => {
        console.log('action getColors: response=',response.data);
        return response.data;
    })
    .catch(error => console.log('action getColors error:',error));

    return {
        type: GET_COLORS,
        payload: request
    }
}
//=========================================================
export function removeColor(id){
    const request = axios.post(`${COLORS_SERVER}/removeColor`,id)
        .then(response => {
            console.log('ACTION REMOVE_COLOR: response=',response);
            console.log('ACTION REMOVE_COLOR: response.data=',response.data);
            console.log('ACTION REMOVE_COLOR: response.status=',response.status);
            return {
                status: response.status,
                colors: response.data
            }})
        .catch(error => console.log('action removeColor error: ',error));

        return {
            type : REMOVE_COLOR,
            payload : request
        }
}
//=========================================================
export function addColor(color, existingColors){
    const request = axios.post(`${COLORS_SERVER}/addColor`,color)
    .then(response => {

        console.log('action addColor: response=',response);
        console.log('ACTION addColor: existingColors=',existingColors);

        let colors=[];

        colors = [ // merging
            ...existingColors,
            response.data.colors
        ];
       
        console.log('action addColor: colors AFTER=',colors);

        return {
            success: response.data.success,
            colors
        }
    });
    return {
        type: ADD_COLOR,
        payload: request
    }
}

//=========================================================
//                       SIZE
//=========================================================
export function getSize(){
    const request = axios.get(`${SIZE_SERVER}/getSize`)
    .then(response => {
        console.log('ACTION GET_SIZE: response=',response.data);
        return response.data
    })
    .catch(error => console.log('ACTION GET_SIZE:',error));

    return {
        type: GET_SIZE,
        payload: request
    }
}
//=========================================================
export function addSize(size, existingSize){
    const request = axios.post(`${SIZE_SERVER}/addSize`,size)
    .then(response => {
        console.log('ACTION addSize: response=',response);
        console.log('ACTION addSize: existingSize=',existingSize);

        let size=[];

        size = [ // merging
            ...existingSize,
            response.data.size
        ];
       
        console.log('action addSize: size AFTER=',size);

        return {
            success: response.data.success,
            size
        }
    })
    .catch(error => console.log('ACTION ADD_SIZE error:',error));

    return {
        type: ADD_SIZE,
        payload: request
    }
}
//=========================================================
export function removeSize(size){
    const request= axios.post(`${SIZE_SERVER}/removeSize`,size)
    .then(response => {
        console.log('ACTION REMOVE SIZE: response=', response);
        return{
            status: response.status,
            size: response.data
        }
    })
    .catch(error => console.log('action removeSize error: ',error));
    return {
        type: REMOVE_SIZE,
        payload: request
    }
}