import React from 'react';
import MyButton from '../utils/button';
import Login from './login';

const RegisterLogin = () => {
    return (
        <div className="page_wrapper">
            <div className="container">
                <div className="register_login_container">
                    <div className="left"> {/*Register New users (Left side) */}
                        <h1>New Customers</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                        <MyButton
                            type="default"
                            title="Create an account"
                            linkTo="/register"
                            addStyles={{
                                margin:'10px 0 0 0'
                            }}
                        />
                    </div>
                    <div className="right"> {/*Login users (Right side) */}
                        <h2>Registered customers</h2>
                        <p>If you have an account please log in.</p>
                        <Login/>
                    </div>
                </div>
                <div className="register_login_container_guest">
                <h1>Continue as guest</h1>
                <div>
                    <MyButton
                        type="default"
                        title="Preceed to checkout"
                        linkTo="/checkout"
                        addStyles={{
                            margin:'10px 0 0 0'
                        }}
                    />
                </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;