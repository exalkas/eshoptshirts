import axios from 'axios';
import {
    ADD_TO_CART,
    GET_CART,
    REMOVE_CART_ITEM,
    UPDATE_CART_ITEM,
    ON_SUCCESS_BUY,
    GET_CART_ITEMS
} from '../actions/types';

import { PRODUCT_SERVER, CART_SERVER } from '../components/utils/servers';

//add to cart with product id
export function addToCart(product){

    const request = axios.post( `${CART_SERVER}/addToCart`,product)
    .then(response => response.data)
    .catch((error) => console.log("Error in action addToCart:",error));

    return {
        type: ADD_TO_CART,
        payload: request
    }
}

// get items in the cart from server. accepts cartitems (array with product ids) 
// and userCart which contains all the cart info for  the user
export function getCartItems(cartItems, userCart){

    console.log("action getCartItems: cartitems=",cartItems);
    console.log("action getCartItems: userCart=",userCart);
    const request = axios.get(`${PRODUCT_SERVER}/byid?id=${cartItems}&type=array`)
                    .then(response => {
     
                        // console.log("action getCartItems: response.date type of=",typeof response.data);
                        console.log("action getCartItems: response.data =",response.data);

                        let tmpArr=[];

                        userCart.forEach(element => { // build cart details with id and all details
                            tmpArr.push({
                                id: response.data.find(product_details => product_details._id===element.product_Id)._id,
                                name: response.data.find(product_details => product_details._id===element.product_Id).name,
                                price: response.data.find(product_details => product_details._id===element.product_Id).price,
                                image: response.data.find(product_details => product_details._id===element.product_Id).images,
                                size: element.size,
                                color: element.color,
                                quantity: element.quantity
                            })
                        });
                        console.log("action getCartItems: AFTER tmparr=",tmpArr);
                        return tmpArr;
                    })
                    .catch(error=>console.log("action getCartItems: error:",error));
                 

    return {
        type: GET_CART_ITEMS,
        payload: request
    }

}

export function getCart(){
    const cart = axios.get(`${CART_SERVER}/getCart`)
    .then(response =>  response.data)
    .catch(error=> console.log("action getCart error:",error));
    return {
        type: GET_CART,
        payload: cart
    }
}

//removes item from cart
export function removeCartItem(product){

    const request = axios.post(`${CART_SERVER}/removeFromCart`,product)
                    .then(response => {
                        // console.log("action: removeCartItem: data.cart",response.data.cart);
                        // console.log("action: removeCartItem: data.cartdetail",response.data.cartDetail);

                        // let tmpArr=[];

                        // userCart.forEach(element => { // build cart details with id and all details
                        //     tmpArr.push({
                        //         id: response.data.find(product_details => product_details._id===element.product_Id)._id,
                        //         name: response.data.find(product_details => product_details._id===element.product_Id).name,
                        //         price: response.data.find(product_details => product_details._id===element.product_Id).price,
                        //         image: response.data.find(product_details => product_details._id===element.product_Id).images,
                        //         size: element.size,
                        //         color: element.color,
                        //         quantity: element.quantity
                        //     })
                        // });
                        // console.log("action getCartItems: AFTER tmparr=",tmpArr);
                        // return tmpArr;

                        
                        return response.data;
                    })

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }

}

// Updates cart Item
export function updateCartItem(product){

    const request= axios.post(`${CART_SERVER}/updateCartItem`,product)
                    .then(response => response.data)

                    return {
                        type: UPDATE_CART_ITEM,
                        payload: request
                    }
}

//when transaction was ok
export function onSuccessBuy(data){ 
    const request = axios.post(`${CART_SERVER}/successBuy`,data)
                    .then(response => response.data)
                    .catch(error => console.log("onSuccessBuy action error:",error));

    return {
        type: ON_SUCCESS_BUY,
        payload: request
    }
}