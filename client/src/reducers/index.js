import { combineReducers } from 'redux';
import user from './user_reducer';
import products from './products_reducer';
import cart from './cart_reducer';
import site from './site_reducer';
import shipping from './shipping_reducer';

const rootReducer = combineReducers({
    user,
    products,
    cart,
    site,
    shipping
});

export default rootReducer;