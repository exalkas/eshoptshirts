/**
 * In app state siteData
 */
import {
    GET_SITE_DATA,
    UPDATE_SITE_DATA
} from '../actions/types';

export default function(state={},action){
    switch(action.type){
        case GET_SITE_DATA:
            console.log("GET_SITE_DATA_REDUCER payload= ",action.payload);
            return { ...state, siteData: action.payload }
        case UPDATE_SITE_DATA:
            return { ...state, siteData: action.payload.siteInfo }
        default:
            return state;
    }
}