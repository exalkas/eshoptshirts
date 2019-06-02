import {
    ADD_TO_CART,
    GET_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    UPDATE_CART_ITEM,
    ON_SUCCESS_BUY
} from '../actions/types';

export default function(state={},action){
    switch(action.type){
        case ADD_TO_CART: //WAS user related
            return {
                ...state, 
                cart: action.payload
            }
        case GET_CART: //was user related
            console.log("reducer GET_CART: action.payload=",action.payload);
            return {...state, cart: action.payload }
        case GET_CART_ITEMS: //get cart details
            console.log("reducer GET_CART_ITEMS: action.payload=",action.payload);
            return {...state, cartDetail:action.payload}
        case REMOVE_CART_ITEM: //was user related
            console.log("reducer REMOVE_CART_ITEM: action.payload=",action.payload);
            return {
                ...state,
                cart: action.payload.cart
            }
        case UPDATE_CART_ITEM:
            return {
                ...state,
                cart: action.payload
            }
        case ON_SUCCESS_BUY: //was user related
            return {
                ...state,
                successBuy: action.payload.success, //update successBuy status
                cart: action.payload.cart
            }
            default:
            return state;
    }
}

