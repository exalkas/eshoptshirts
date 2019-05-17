import {GET_SHIPPING_DATA, ADD_SHIPPING, REMOVE_SHIPPING} from '../actions/types';
import { SHIPPING_SERVER } from '../components/utils/servers';

import axios from 'axios';

export function getShipping(filter){
    const request= axios.post(`${SHIPPING_SERVER}/getShipping`,filter)
    .then(response => {
        console.log("action getshipping: response.data=",response.data);
        return response.data;})
    .catch(error => console.log("action getShipping error:",error) );

        return {
            type: GET_SHIPPING_DATA,
            payload: request
        }
  }

  export function addShipping(shipping, existingShippings){
      const request = axios.post(`${SHIPPING_SERVER}/addShipping`, shipping)
      .then(response => {
        console.log('ACTION ADD_SHIPPING response=',response);

            let shipping=[];

            shipping=[ // merge shipping that comes from server with existing
                ...existingShippings,
                response.data.shipping
            ];
            
            console.log('ACTION ADD_SHIPPING SHIPPING=',shipping);
        return{
            success: response.data.success,
            shipping
        }
      })
      .catch(error => console.log('ACTION ADD_SHIPPING error:',error));
      
      return {
        type: ADD_SHIPPING,
        payload: request
      }
  }

  export function removeShipping(shipping){
    const request = axios.post(`${SHIPPING_SERVER}/removeShipping`, shipping)
    .then(response => {
        console.log('ACTION REMOVE_SHIPPING response=',response);

        return {
            status: response.status,
            shipping: response.data
        }
    }).catch(error => console.log('ACTION REMOVE_SHIPPING error:',error));

    return {
        type: REMOVE_SHIPPING,
        payload: request
    }
  }