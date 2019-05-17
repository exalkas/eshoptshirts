import axios from 'axios';
import {
    GET_SITE_DATA,
    UPDATE_SITE_DATA
} from './types';

import { SITE_SERVER } from '../components/utils/servers';

export function getSiteData(){

    const request = axios.get(`${SITE_SERVER}/site_data`)
                    .then(response => response.data)
                    .catch((error)=> console.log("getSiteData error: ",error));

    return {
        type: GET_SITE_DATA,
        payload: request
    }

}

export function updateSiteData(dataToSubmit){

    const request = axios.post(`${SITE_SERVER}/site_data`, dataToSubmit)
        .then(response => response.data)
        .catch((error)=> console.log("UpdateSiteData error: ",error));

    return {
        type: UPDATE_SITE_DATA,
        payload: request
    }

}

