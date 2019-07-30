import React, { Component } from 'react';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { connect } from 'react-redux';
import Cryptr from 'cryptr';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Todo from './pages/Todo';
import Feedback from './pages/Feedback';
import Header from './components/Header/Header';
import Notification from './components/Notifications/NotificationContainer';
import Sidebar from './components/Sidebar/Sidebar';
import { getCookie } from './core/lib/cookies';
import * as actions from './core/actions';
import config from './config/config.json';
import './css/vendor/flexboxgrid.css';

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
    const cryptr = new Cryptr(config.secretKey);
    let user = getCookie('user');
    if (user && token) {
      try {
        user = JSON.parse(cryptr.decrypt(user));
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
        <Route path="*" component={Header}/>
        <Route path="/" exact component={Home}/>
        <Route path="/login" component={Login}/>
        <Route path="/registration" component={Register}/>
        <Route path={["/todo/:type/:project", "/todo"]} component={Todo}/>
        <Route path="/feedback" component={Feedback}/>
        <Sidebar/>
        <Notification/>
      </Router>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);