import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Cryptr from 'cryptr';
import AuthContainer from '../components/pages/AuthContainer';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import * as actions from '../core/actions';
import { setCookie } from '../core/lib/cookies';
import config from '../config/config.json';
import '../css/pages/login/base.css';

const mapStateToProps = (state) => {
  const { login, password, token, current } = state.user;
  const props = {
    login,
    password,
    token,
    currentUser: current,
  };
  return props;
};

const actionCreators = {
  updUserLogin: actions.updUserLogin,
  updUserPassword: actions.updUserPassword,
  authUser: actions.authUser,
  getUser: actions.getUser,
};

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 240,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Login extends Component {
  handleChange = prop => event => {
    const { updUserLogin, updUserPassword } = this.props;
    const actionMap = {
      'login': updUserLogin,
      'password': updUserPassword,
    };
    actionMap[prop]({ [prop]: event.target.value });
  };

  auth = async () => {
    const { authUser, login, password } = this.props;
    const token = await authUser({ login, password });
    if (token) {
      this.getUser();
    }
  };

  getUser = () => {
    const { token, getUser } = this.props;
    getUser({ token }).then(user => {
      const expire = 1000 * 60 * 60 * 24 * 30;
      const cryptr = new Cryptr(config.secretKey);
      const encodeUser = cryptr.encrypt(JSON.stringify(user));
      setCookie('token', token, { expires: new Date(Date.now() + expire) });
      setCookie('user', encodeUser, { expires: new Date(Date.now() + expire) });
    });
  }

  render () {
    const { classes, login, password } = this.props;

    return (
      <div id="login">
        <AuthContainer>
          <div className={classes.root}>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-login">Login</InputLabel>
              <Input
                id="adornment-login"
                type='text'
                value={login}
                onChange={this.handleChange('login')}
              />
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                type='password'
                value={password}
                onChange={this.handleChange('password')}
              />
            </FormControl>
            <Button variant="outlined" color="primary" onClick={() => this.auth()} className={classes.button}>
              Войти
            </Button>
          </div>
        </AuthContainer>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Login));