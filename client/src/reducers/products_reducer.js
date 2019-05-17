/**
 * product related reducers
 */
import {
    GET_PRODUCTS_BEST_SELLING,
    GET_PRODUCTS_NEWEST,
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
} from '../actions/types';
 

export default function(state={},action){
    switch(action.type){
        case GET_PRODUCTS_BEST_SELLING:
            return {...state, bestSelling: action.payload }
        case GET_PRODUCTS_NEWEST:
            return {...state, newestProducts:  action.payload }
        case GET_CATEGORIES:
            return {...state, categories: action.payload }
        case ADD_CATEGORY:
            return {
                ...state, 
                addCategory: action.payload.success , 
                categories:action.payload.categories 
            }
        case GET_DEPARTMENTS:
            return {...state, departments: action.payload }
        case ADD_DEPARTMENT:
            return {
                ...state, 
                addDepartment: action.payload.success , 
                departments:action.payload.departments 
            }
        case GET_PRODUCTS_TO_SHOP:
            return {
                ...state,
                toShop: action.payload.products,
                toShopSize: action.payload.size
            }
        case ADD_PRODUCT:
            return { ...state,addProduct: action.payload }
        case REMOVE_PRODUCT:
            return { ...state,removeProduct: action.payload }
        case UPDATE_PRODUCT:
            return { ...state,updateProduct: action.payload }            
        case CLEAR_PRODUCT:
            return { ...state,addProduct: action.payload }
        case GET_PRODUCT_DETAIL:
            return {...state, prodDetail: action.payload }
        case CLEAR_PRODUCT_DETAIL:
            return {...state, prodDetail: action.payload }
        case GET_COLORS:
            return {...state, colors : action.payload}
        case ADD_COLOR:
            console.log('REDUCER ADD_COLOR: action.payload=', action.payload);
            return {...state, 
                    addColor : action.payload.success,
                    colors : action.payload.colors}
        case REMOVE_COLOR:
            console.log('REDUCER REMOVE COLOR: action.payload=', action.payload);
            return {...state, colors: action.payload.colors}
        case GET_SIZE:
            console.log('REDUCER GET_SIZE: action.payload=',action.payload);
            return {...state,size: action.payload}
        case ADD_SIZE:
            console.log('REDUCER ADD_SIZE: action.payload=',action.payload);
            return {
                ...state,
                addSize: action.payload.success,
                size: action.payload.size
            }
        case REMOVE_SIZE:
            console.log('REDUCER REMOVE_SIZE: action.payload=',action.payload);
            return{...state, size: action.payload.size}
        default:
            return state;
    }
}