/**
 * Header for User dashboard
 */
import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';

import { connect } from 'react-redux';//will dispatch logoutUser action

import { logoutUser } from '../../../actions/user_actions';

import logo from '../../../Resources/logo.png';

class Header extends Component {

    state = {
        page:[
            {
                name:'Home',
                linkTo:'/',
                public: true
            }
        ],
        user:[
            {
                name:'My Cart',
                linkTo:'/cart',
                public: true
            },
            {
                name:'My Account',
                linkTo:'/user/dashboard',
                public: false
            },
            {
                name:'Log in',
                linkTo:'/register_login',
                public: true
            },
            {
                name:'Log out',
                linkTo:'/user/logout',
                public: false
            },
        ]
    }

    //dispatch that user is logged out and redirect him to /
    logoutHandler = () => {
        this.props.dispatch(logoutUser()).then(response =>{
            if(response.payload.success){
                this.props.history.push('/')
            }
        })
    }


    /**
     * returns cart link with number of items in the cart
     */
    cartLink = (item,i) => {
        // const cart = this.props.cart;
        console.log("Header: state.cart=",this.props.cart);
        // console.log("Header: cart length=",cart.cart.length);

        //this.props.cart!=='undefined' && this.props.cart.cart

        console.log("Header index: Object.keys(this.props.cart).length=",Object.keys(this.props.cart).length);
        return (
            <div className="cart_link" key={i}>
                <span>{ ("cart" in this.props.cart) && this.props.cart.cart.length>0 ?  this.props.cart.cart.length :0}</span> 
                <Link to={item.linkTo}>
                    {item.name}
                </Link>
            </div>
        )
    }


    //handles all links and logout link as well
    defaultLink = (item,i) => (
        item.name === 'Log out' ?
            <div className="log_out_link"
                key={i}
                onClick={()=> this.logoutHandler()}
            >
                {item.name}
            </div>

        :
        <Link to={item.linkTo} key={i}>
            {item.name}
        </Link>
    )


    showLinks = (type) =>{
        let list = [];

        if(this.props.user.userData){
            type.forEach((item)=>{//loop through state
                if(!this.props.user.userData.isAuth){//is the user not authed?
                    if(item.public === true){//if link is public add it to the list
                        list.push(item)
                    }
                } else{
                    if(item.name !== 'Log in'){//add only Log in link
                        list.push(item)
                    }
                }
            });
        }

        return list.map((item,i)=>{ //after processing loop through list array and render linnks
            if(item.name !== 'My Cart'){
                return this.defaultLink(item,i) //render links except cart link. pass "i" as the key
            } else {
                return this.cartLink(item,i) //render cart links
            }
            
        })
    }


    render() {
        return (
            <header className="bck_b_light">
                <div className="container">
                    <div className="left">
                    <Link to="/">
                        <div className="logo" style={{background:`url(${logo}) no-repeat center`}}>
                            
                        </div> 
                    </Link>                        
                    </div>
                    <div className="right">
                        <div className="top">
                            {this.showLinks(this.state.user)}
                        </div>
                        <div className="bottom">
                            {this.showLinks(this.state.page)}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

function mapStateToProps(state){
    return {
        user: state.user, //user data are needed from the app state
        cart: state.cart
    }
}

export default connect(mapStateToProps)(withRouter(Header)); //needs withrouter to access props history