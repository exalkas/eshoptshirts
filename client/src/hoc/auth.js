/**
 * It's a HOC to render the input component.
 * It's a composed component. It means a class inside a function
 * 
 * Checks if user is logged in. 
 * For complete private routes its true
 * else will be false
 * if the route is completely public then accepts null
 * For administrators accepts a 3rd parameter which is the adminroute
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';//will dispatch an action to fetch form the server
import { auth } from '../actions/user_actions';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function(ComposedClass,reload,adminRoute = null){//Component to be rendered, private/public, adminroute
    class AuthenticationCheck extends Component {

        state = {
            loading: true
        }

        componentDidMount(){
            this.props.dispatch(auth()).then(response =>{//get info from server
                let user = this.props.user.userData;

                if(!user.isAuth){//is the user not authed?
                    if(reload){ //is it a complete private route?
                        this.props.history.push('/register_login') //send user to register
                    }
                } else{ //or he is authed
                    if(adminRoute && !user.isAdmin){ //or if he is not an admin and wants to access admin area
                        this.props.history.push('/user/dashboard')//send him to his dashboard
                    } else{
                        if(reload === false){//so he is an admin or wants an amin route and the area is not completely private
                            this.props.history.push('/user/dashboard')//send him to his dashboard
                        }
                    }
                }
                this.setState({loading:false})
            })
        }


        render() {
            if(this.state.loading){
                return (
                    <div className="main_loader">
                        <CircularProgress style={{color:'#2196F3'}} thickness={7}/> 
                    </div>
                )
            }
            return (
               <ComposedClass {...this.props} user={this.props.user}/>
            );
        }
    }

    function mapStateToProps(state){
        return {
            user: state.user //this is what is needed to access from app state
        }
    }

    return connect(mapStateToProps)(AuthenticationCheck)
}


