import React, { Component } from 'react';
import SignIn from '../Components/auth/SingIn'
import AuthDetails from "../Components/auth/AuthDetails";

class signin extends Component {
    render() {
        return (
            <div>
                <SignIn />
                <AuthDetails />
            </div>
        );
    }
}

export default signin;