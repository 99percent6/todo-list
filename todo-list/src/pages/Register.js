import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link, } from "react-router-dom";
import AuthContainer from '../components/pages/AuthContainer';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Loader from '../components/loader'; 
import * as actions from '../core/actions';
import validator from 'validator';
import ValidationMessage from '../components/pages/ValidationMessage';
import '../css/pages/register/base.css';

const mapStateToProps = (state) => {
  const { token, current } = state.user;
  const { login, password, repeatedPassword, name, email } = state.userRegistration;
  const { registrationUserState } = state.UIState;
  const props = {
    login,
    password,
    repeatedPassword,
    name,
    email,
    token,
    currentUser: current,
    registrationUserState,
  };
  return props;
};

const actionCreators = {
  updRegistrationUserLogin: actions.updRegistrationUserLogin,
  updRegistrationUserPassword: actions.updRegistrationUserPassword,
  updRegistrationUserRepeatedPassword: actions.updRegistrationUserRepeatedPassword,
  updRegistrationUserName: actions.updRegistrationUserName,
  updRegistrationUserEmail: actions.updRegistrationUserEmail,
  getUser: actions.getUser,
  registrationUser: actions.registrationUser,
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
    marginTop: '10px',
    margin: theme.spacing(),
    minWidth: '200px',
  },
});

class Register extends Component {
  state = {
    isValidLogin: '',
    isValidPassword: '',
    isEqualPasswords: '',
    isValidEmail: '',
    isValidName: '',
  };

  registrationUser = () => {
    const { registrationUser, login, password, repeatedPassword, name, email, setNotification, history } = this.props;
    const user = {
      login,
      password,
      repeatedPassword,
      name,
      email,
    }
    registrationUser({ user }).then(result => {
      const { registrationUserState } = this.props;
      if (result.code === 200) {
        if (registrationUserState === 'success') {
          setNotification({ open: true, message: 'Вы успешно зарегистрировались', type: 'success' });
          history.push('/login');
        }
      } else if (result.code === 500 && (result.result === 'Login busy' || result.result === 'Email busy')) {
        if (registrationUserState === 'fail') {
          const message = `${result.result.includes('Login') ? 'Логин' : 'Email'} уже занят`;
          setNotification({ open: true, message: message, type: 'error' });
        }
      }
    });
  }

  renderBtn = () => {
    const { classes, registrationUserState } = this.props;
    const { isValidLogin, isValidPassword, isEqualPasswords, isValidEmail, isValidName } = this.state;
    const isValidForm = isValidLogin && isValidPassword && isEqualPasswords && isValidEmail && isValidName;
    if (registrationUserState === 'request') {
      return (
        <Button variant="outlined" color="secondary" className={classes.button}>
          <Loader/>
        </Button>
      );
    } else if (registrationUserState === 'success') {
      return (
        <Button variant="outlined" color="primary" component={Link} to={{pathname: "/login"}} className={classes.button}>
          Войти
        </Button>
      );
    } else {
      return (
        <Button variant="outlined" color="secondary" disabled={!isValidForm} onClick={() => this.registrationUser()} className={classes.button}>
          Регистрация
        </Button>
      );
    }
  };

  validationFields = (value, field) => {
    switch (field) {
      case 'login':
        const isValidLogin = !validator.isEmpty(value) && validator.isAlphanumeric(value);
        this.setState({ isValidLogin });
        break;
      case 'password':
        const isValidPassword = !validator.isAlpha(value, ['ru-RU']) && !validator.isEmpty(value) && value.length >= 6;
        this.setState({ isValidPassword });
        break;
      case 'repeatedPassword':
        const isEqualPasswords = validator.equals(value, this.props.password) && !validator.isEmpty(value);
        this.setState({ isEqualPasswords });
        break;
      case 'email':
        const isValidEmail = validator.isEmail(value) && !validator.isEmpty(value);
        this.setState({ isValidEmail });
        break;
      case 'name':
        const isValidName = !validator.isEmpty(value);
        this.setState({ isValidName });
        break;
      default:
        break;
    };
  };

  handleChange = prop => event => {
    const { updRegistrationUserLogin, updRegistrationUserPassword, updRegistrationUserRepeatedPassword,
      updRegistrationUserName, updRegistrationUserEmail } = this.props;
    const { value } = event.target;
    const actionMap = {
      'login': updRegistrationUserLogin,
      'password': updRegistrationUserPassword,
      'repeatedPassword': updRegistrationUserRepeatedPassword,
      'name': updRegistrationUserName,
      'email': updRegistrationUserEmail,
    };
    actionMap[prop]({ [prop]: value });
    this.validationFields(value, prop);
  };

  render() {
    const { classes, login, password, repeatedPassword, name, email } = this.props;
    const { isValidLogin, isValidPassword, isEqualPasswords, isValidEmail, isValidName } = this.state;

    return (
      <div id="register">
        <AuthContainer>
          <div className={classes.root}>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-login">Введите логин*</InputLabel>
              <Input
                id="adornment-login"
                type='text'
                value={login}
                onChange={this.handleChange('login')}
              />
            </FormControl>
            <ValidationMessage message="Некорректный логин" isVisible={!isValidLogin}/>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-password">Пароль*</InputLabel>
              <Input
                id="adornment-password"
                type='password'
                value={password}
                onChange={this.handleChange('password')}
              />
            </FormControl>
            <ValidationMessage message="Пароль должен содержать не менее 6 символов" isVisible={!isValidPassword}/>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-repeated-password">Повторите пароль*</InputLabel>
              <Input
                id="adornment-repeated-password"
                type='password'
                value={repeatedPassword}
                onChange={this.handleChange('repeatedPassword')}
              />
            </FormControl>
            <ValidationMessage message="Пароли не совпадают" isVisible={!isEqualPasswords}/>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-email">Email*</InputLabel>
              <Input
                id="adornment-email"
                type='text'
                value={email}
                onChange={this.handleChange('email')}
              />
            </FormControl>
            <ValidationMessage message="Некорректный email" isVisible={!isValidEmail}/>
            <FormControl className={classNames(classes.margin, classes.textField)}>
              <InputLabel htmlFor="adornment-name">Имя*</InputLabel>
              <Input
                id="adornment-name"
                type='text'
                value={name}
                onChange={this.handleChange('name')}
              />
            </FormControl>
            <ValidationMessage message="Обязательное поле" isVisible={!isValidName}/>
            { this.renderBtn() }
          </div>
        </AuthContainer>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Register));