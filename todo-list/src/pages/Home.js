import React, { Component } from 'react';
import { Link, } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AuthContainer from '../components/pages/AuthContainer';
import '../css/pages/home/base.scss';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
});

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div id="home">
        <AuthContainer>
          <div className="buttons">
            <Button variant="outlined" color="primary" component={Link} to={{pathname: "/login"}} className={classes.button}>
              Войти
            </Button>
            <Button variant="outlined" color="secondary" component={Link} to={{pathname: "/registration"}} className={classes.button}>
              Зарегистрироваться
            </Button>
          </div>
        </AuthContainer>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);