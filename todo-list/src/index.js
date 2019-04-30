import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import './index.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Todo from './pages/Todo';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './core/reducers';
import './core/db';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk),
);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <Route path="/" exact component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/registration" component={Register}/>
      <Route path="/todo" component={Todo}/>
    </Provider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
