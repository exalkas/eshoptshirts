import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
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