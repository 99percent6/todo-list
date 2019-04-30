import React, { Component } from 'react';
import '../../css/components/auth/base.css';

class AuthContainer extends Component {
  render() {
    const { children } = this.props;
    return (
      <div className="auth-container">
        { children }
      </div>
    );
  }
}

export default AuthContainer;