import React, { Component } from 'react';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { connect } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Todo from './pages/Todo';
import { getCookie } from './core/lib/cookies';
import * as actions from './core/actions';

const mapStateToProps = (state) => {
  const { current, token } = state.user;
  const props = {
    token,
    currentUser: current,
  };
  return props;
};

const actionCreators = {
  updUserToken: actions.updUserToken,
  updUserCurrent: actions.updUserCurrent,
};

class App extends Component {
  constructor(props) {
    super(props);
    const { updUserToken, updUserCurrent } = props;
    const token = getCookie('token');
    let user = getCookie('user');
    if (user && token) {
      try {
        user = JSON.parse(atob(user));
      } catch (error) {
        console.error(error);
      }
      updUserToken({ token });
      updUserCurrent({ user });
    }
  }

  render() {
    return (
      <Router>
        <Route path="/" exact component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/registration" component={Register}/>
        <Route path="/todo" component={Todo}/>
      </Router>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);