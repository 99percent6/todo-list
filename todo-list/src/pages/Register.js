import React, { Component } from 'react';
import AuthContainer from '../components/pages/AuthContainer';
import '../css/pages/register/base.css';

class Register extends Component {
  render() {
    return (
      <div id="register">
        <AuthContainer>
          <span>Register</span>
        </AuthContainer>
      </div>
    );
  }
}

export default Register;