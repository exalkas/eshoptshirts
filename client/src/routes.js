import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './hoc/layout';
import Auth from './hoc/auth';

import Home from './components/Home';
import ProductPage from './components/Product_Details';
import UserCart from './components/Cart/cart';
import Checkout from './components/Checkout_steps/checkout';


import RegisterLogin from './components/Register_login';
import Register from './components/Register_login/register';

import ResetUser from './components/Reset_user';
import ResetPass from './components/Reset_user/reset_pass';

import UserDashboard from './components/User/dashboard';
import UpdateProfile from './components/User/update_profile';
import PurchaseHistory from './components/User/purchase_history';

import ManageProducts from './components/User/Admin/manage_products';
import ManageCategories from './components/User/Admin/manage_categories';
import ManageDepartments from './components/User/Admin/manage_departments';
import ManageColors from './components/User/Admin/manage_colors';
import ManageSize from './components/User/Admin/manage_size';
import ManageShipping from './components/User/Admin/manage_shipping';
import ManageSite from './components/User/Admin/manage_site';
import AddFile from './components/User/Admin/add_file';

import PageNotFound from './components/utils/page_not_found';


const Routes = () => {
  return(
    <Layout>
      <Switch>
        <Route path="/" exact component={Auth(Home,null)}/>
        <Route path="/cart" exact component={UserCart}/>
        <Route path="/checkout" exact component={Auth(Checkout,null)}/>

        <Route path="/product_detail/:id" exact component={ProductPage}/>
        
        <Route path="/register" exact component={Auth(Register,false)}/>
        <Route path="/register_login" exact component={Auth(RegisterLogin,false)}/>
        <Route path="/reset_password/:token" exact component={Auth(ResetPass,false)}/>
        <Route path="/reset_user" exact component={Auth(ResetUser,false)}/>

        <Route path="/user/dashboard" exact component={Auth(UserDashboard,true)}/>
        <Route path="/user/user_profile" exact component={Auth(UpdateProfile,true)}/>
        <Route path="/user/purchase_history" exact component={Auth(PurchaseHistory,true)}/>

        <Route path="/admin/manage_products" exact component={Auth(ManageProducts,true)}/>
        <Route path="/admin/manage_categories" exact component={Auth(ManageCategories,true)}/>
        <Route path="/admin/manage_departments" exact component={Auth(ManageDepartments,true)}/>
        <Route path="/admin/manage_colors" exact component={Auth(ManageColors,true)}/>
        <Route path="/admin/manage_size" exact component={Auth(ManageSize,true)}/>
        <Route path="/admin/manage_shipping" exact component={Auth(ManageShipping,true)}/>
        <Route path="/admin/site_info" exact component={Auth(ManageSite,true)}/>
        <Route path="/admin/add_file" exact component={Auth(AddFile,true)}/>

        <Route component={Auth(PageNotFound)}/>
        
        {/* <Route path="/user/dashboard" exact component={Auth(UserDashboard,true)}/>
            <Route path="/user/user_profile" exact component={Auth(UpdateProfile,true)}/>

            <Route path="/admin/add_product" exact component={Auth(AddProduct,true)}/>
            <Route path="/admin/manage_categories" exact component={Auth(ManageCategories,true)}/>
            <Route path="/admin/site_info" exact component={Auth(ManageSite,true)}/>
            <Route path="/admin/add_file" exact component={Auth(AddFile,true)}/>

        <Route path="/reset_password/:token" exact component={Auth(ResetPass,false)}/>
        <Route path="/reset_user" exact component={Auth(ResetUser,false)}/>
        <Route path="/product_detail/:id" exact component={Auth(ProductPage,null)}/>
        <Route path="/register" exact component={Auth(Register,false)}/>
        <Route path="/register_login" exact component={Auth(RegisterLogin,false)}/>
        
        <Route path="/" exact component={Auth(Home,null)}/>
        <Route component={Auth(PageNotFound)}/> */}

      </Switch>
    </Layout>

  )
}

export default Routes;
