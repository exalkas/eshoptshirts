/**
 * User dashboard layout
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

//user menu
const links = [
    {
        name: 'Dashboard',
        linkTo: '/user/dashboard'
    },
    {
        name: 'User information',
        linkTo: '/user/user_profile'
    },
    {
        name: 'My Cart',
        linkTo: '/cart'
    },
    {
        name: 'Purchase History',
        linkTo: '/user/purchase_history'
    }
]

//admin menu
const admin = [
    {
        name: 'Site info',
        linkTo: '/admin/site_info'
    },
    {
        name: 'Manage products',
        linkTo: '/admin/manage_products'
    },
    {
        name: 'Manage categories',
        linkTo: '/admin/manage_categories'
    },
    {
        name: 'Manage departments',
        linkTo: '/admin/manage_departments'
    },
    {
        name: 'Manage Size',
        linkTo: '/admin/manage_size'
    },
    {
        name: 'Manage Colors',
        linkTo: '/admin/manage_colors'
    },
    {
        name: 'Manage Shipping Methods',
        linkTo: '/admin/manage_shipping'
    },
    {
        name: 'Upload file',
        linkTo: '/admin/add_file'
    }
]


const UserLayout = (props) => {

    //generate menu for user
    const generateLinks = (links) => (
        links.map((item,i)=>(
            <Link to={item.linkTo} key={i}>
                {item.name}
            </Link>
        ))
    )


    return (
        <div className="container">
            <div className="user_container">
                <div className="user_left_nav">
                    <h2>MY ACCOUNT</h2>
                    <div className="links">
                        { generateLinks(links)}
                    </div>
                    { props.user.userData.isAdmin ?//check if is admin
                        <div>
                            <h2>Admin</h2>
                            <div className="links">
                                { generateLinks(admin)}
                            </div>
                        </div>
                    :null
                    }

                </div>
                <div className="user_right">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user //get user from state app
    }
}


export default connect(mapStateToProps)(UserLayout);