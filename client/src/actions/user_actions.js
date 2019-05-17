import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    // REMOVE_CART_ITEM,
    // ON_SUCCESS_BUY,
    UPDATE_DATA_USER,
    CLEAR_UPDATE_USER_DATA,
    GET_ORDER_HISTORY
} from './types';

import { USER_SERVER } from '../components/utils/servers';


export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => {
            return response.data;
        })
        .catch((error)=> console.log("action registerUser error: ",error));
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){

    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }

}


export function logoutUser(){

    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }

}

// get items in the cart from server. accepts cartitems (array with product ids) 
// and userCart which contains all the cart info for  the user
// export function getCartItems(cartItems, userCart){

//     console.log("getCartItems: cartitems=",cartItems);
//     console.log("getCartItems: userCart=",userCart);
//     const request = axios.get(`${PRODUCT_SERVER}/byid?id=${cartItems}&type=array`)
//                     .then(response => {
     
//                         userCart.forEach(item=>{ //loop through user cart 
//                             response.data.forEach((k,i)=>{//loop through response from server
//                                 if(item.id === k._id){ //if item in the user cart is in the server also
//                                     response.data[i].quantity = item.quantity;//update quantity
//                                 }
//                             })
//                         })
//                         return response.data;
//                     })
//                     .catch(error=>console.log("action byid: error:",error));
                 

//     return {
//         type: GET_CART_ITEMS,
//         payload: request
//     }

// }

//removes item from cart
// export function removeCartItem(id){

//     const request = axios.get(`${USER_SERVER}/removeFromCart?_id=${id}`)
//                     .then(response => {
//                         console.log("action: removeCartItem: data.cart",response.data.cart);
//                         console.log("action: removeCartItem: data.cartdetails",response.data.cartDetail);

//                         response.data.cart.forEach(item=>{// loop through response. contains id, qunatity and date
//                             response.data.cartDetails.forEach((k,i)=>{//loop through response, contains all details in cart
//                                 if(item.id === k._id){
//                                     response.data.cartDetails[i].quantity = item.quantity;//update quantity
//                                 }
//                             })
//                         })
//                             return response.data;
//                     })

//     return {
//         type: REMOVE_CART_ITEM,
//         payload: request
//     }

// }


// //when transaction was ok
// export function onSuccessBuy(data){ 
//     const request = axios.post(`${USER_SERVER}/successBuy`,data)
//                     .then(response => response.data);

//     return {
//         type: ON_SUCCESS_BUY,
//         payload: request
//     }
// }//add error handling

//update user profile
export function updateUserData(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/update_profile`,dataToSubmit) //send data
                    .then(response => {
                        return response.data
                    }).catch(error=> console.log("action updateUserData error:",error));
    
    return {
        type: UPDATE_DATA_USER,
        payload: request
    } 
}

export function getOrderHistory(){
    const request= axios.post(`${ USER_SERVER }/getOrderHistory`)
        .then(response => {
            console.log('action getOrderHistory: response=',response);
            return response.data;
    }).catch(error => console.log('action getorderhistory error:',error));

    return {
        type: GET_ORDER_HISTORY,
        payload: request
    }
}

export function clearUpdateUser(){
    return {
        type: CLEAR_UPDATE_USER_DATA,
        payload: ''
    }
}