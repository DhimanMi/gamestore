import React, { Component } from 'react';
import SignUp from '../Components/auth/SignUp'
import AuthDetails from "../Components/auth/AuthDetails";

class signup extends Component {
    render() {
        return (
            <div>
                <SignUp />
                <AuthDetails />
            </div>
        );
    }
}

export default signup;