import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import AuthContainer from '../components/pages/AuthContainer';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import * as actions from '../core/actions';
import '../css/pages/login/base.css';

const mapStateToProps = (state) => {
  const { login, password, token } = state.user;
  const props = {
    login,
    password,
    token,
  };
  return props;
};

const actionCreators = {
  updUserLogin: actions.updUserLogin,
  updUserPassword: actions.updUserPassword,
  authUser: actions.authUser,
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

  auth = () => {
    const { authUser, login, password } = this.props;
    authUser({ login, password });
  };

  render () {
    const { classes, login, password } = this.props;
    console.log('--------------------', this.props);
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