import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitIcon from '@material-ui/icons/ExitToAppRounded';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import * as actions from '../../core/actions';

const mapStateToProps = (state) => {
  const { token, current } = state.user;
  const props = {
    token,
    currentUser: current,
  };
  return props;
};

const actionCreators = {
  logout: actions.logout,
  setNotification: actions.setNotification,
};

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  exitIcon: {
    marginRight: '10px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  }
};

class Header extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logout = async () => {
    const { logout, setNotification, token, history } = this.props;
    const result = await logout({ token });
    if (result && result.code === 200) {
      setNotification({ open: true, message: 'Вы успешно вышли из аккаунта', type: 'success' });
      history.replace('/');
    } else {
      setNotification({ open: true, message: 'Ошибка при выходе из аккаунта', type: 'error' });
    }
    this.handleClose();
  };

  render() {
    const { classes, token, currentUser } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const auth = Boolean(token && currentUser);
    
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link className={classes.link} to={{ pathname: '/' }}>The Tasker</Link>
            </Typography>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.logout}>
                    <ExitIcon className={classes.exitIcon}/>
                    Выйти
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Header));