import { 
    GET_SHIPPING_DATA,
    ADD_SHIPPING,
    REMOVE_SHIPPING
} from '../actions/types';

export default function(state={},action){
    switch (action.type){
        case GET_SHIPPING_DATA:
            console.log('REDUCER ADD_SHIPPING: action.payload=',action.payload);
            return {...state, shipping:action.payload.shipping}
        case ADD_SHIPPING:
            console.log('REDUCER ADD_SHIPPING: action.payload=',action.payload); 
            return {
                ...state,
                success: action.payload.success,
                shipping: action.payload.shipping
            }
        case REMOVE_SHIPPING:
            console.log('REDUCER REMOVE_SHIPPING: action.payload=',action.payload);
            return {...state, size: action.payload.shipping}
        default:
            return state;
    }
}