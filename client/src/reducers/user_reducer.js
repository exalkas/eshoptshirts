import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    UPDATE_DATA_USER,
    CLEAR_UPDATE_USER_DATA,
    GET_ORDER_HISTORY
} from '../actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload } //you choose the key name e.g. register. you must use the same in the app when you call it. it's in the state app
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case UPDATE_DATA_USER:
            return {...state, updateUser: action.payload} //update state wieh new user profile
        case CLEAR_UPDATE_USER_DATA:
            return {...state, updateUser: action.payload}
        case GET_ORDER_HISTORY:
            return {...state, history: action.payload}
        default:
            return state;
    }
}