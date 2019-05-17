import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../../css/components/auth/base.css';

const mapStateToProps = (state) => {
  const { token, current } = state.user;
  const props = {
    token,
    currentUser: current,
  };
  return props;
};

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    margin: theme.spacing(),
  },
});

class AuthContainer extends Component {
  renderBtn = () => {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Button variant="outlined" color="primary" component={Link} to={{pathname: "/todo/tasks/all"}} className={classes.button}>
          Начать действовать
        </Button>
      </div>
    );
  }

  render() {
    const { children, token, currentUser } = this.props;
    return (
      <div className="auth-container">
        { token && currentUser ? this.renderBtn() : children }
      </div>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(AuthContainer));