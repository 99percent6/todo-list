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
import Loader from '../components/loader'; 
import '../css/pages/login/base.css';

const mapStateToProps = (state) => {
  const { token, current } = state.user;
  const { authUserState } = state.UIState;
  const { login, password } = state.userAuth;
  const props = {
    login,
    password,
    token,
    currentUser: current,
    authUserState,
  };
  return props;
};

const actionCreators = {
  updUserLogin: actions.updUserLogin,
  updUserPassword: actions.updUserPassword,
  authUser: actions.authUser,
  getUser: actions.getUser,
  setNotification: actions.setNotification,
};

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  margin: {
    margin: theme.spacing(),
  },
  textField: {
    flexBasis: 240,
  },
  button: {
    margin: theme.spacing(),
    minWidth: '80px',
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

  handleKeyPress = (e) => {
    const event = e;
    if (event.key === 'Enter') {
      this.auth();
    }
  };

  auth = async () => {
    const { authUser, login, password, setNotification } = this.props;
    const token = await authUser({ login, password });
    if (token) {
      this.getUser();
    } else {
      const { authUserState } = this.props;
      if (authUserState === 'fail') {
        setNotification({ open: true, message: 'Неверный логин или пароль.', type: 'error' });
      }
    }
  };

  getUser = () => {
    const { token, getUser, history } = this.props;
    getUser({ token }).then(user => {
      if (user) {
        const expire = 1000 * 60 * 60 * 24 * 30;
        const cryptr = new Cryptr(config.secretKey);
        const encodeUser = cryptr.encrypt(JSON.stringify(user));
        setCookie('token', token, { expires: new Date(Date.now() + expire) });
        setCookie('user', encodeUser, { expires: new Date(Date.now() + expire) });
        history.replace('/todo');
      }
    });
  };

  renderBtn = () => {
    const { authUserState, classes } = this.props;
    if (authUserState === 'request') {
      return (
        <Button variant="outlined" color="primary" className={classes.button}>
          <Loader/>
        </Button>
      );
    } else {
      return (
        <Button variant="outlined" color="primary" onClick={() => this.auth()} className={classes.button}>
          Войти
        </Button>
      );
    }
  };

  render () {
    const { classes, login, password } = this.props;

    return (
      <div id="login">
        <AuthContainer>
          <div className={classes.root}>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-login">Логин</InputLabel>
              <Input
                id="adornment-login"
                type='text'
                value={login}
                onChange={this.handleChange('login')}
                onKeyPress={this.handleKeyPress}
              />
            </FormControl>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-password">Пароль</InputLabel>
              <Input
                id="adornment-password"
                type='password'
                value={password}
                onChange={this.handleChange('password')}
                onKeyPress={this.handleKeyPress}
              />
            </FormControl>
            { this.renderBtn() }
          </div>
        </AuthContainer>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Login));