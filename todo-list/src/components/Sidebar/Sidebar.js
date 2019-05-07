import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import * as actions from '../../core/actions';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';

const mapStateToProps = (state) => {
  const { isVisibleSidebar } = state.UIState;
  const props = {
    isVisibleSidebar
  };
  return props;
};

const actionCreators = {
  changeVisibleSidebar: actions.changeVisibleSidebar,
};

const styles = {
  text: {
    padding: '0 ',
  },
  list: {
    width: 300,
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '500',
    height: '64px',
    backgroundColor: '#3f51b5',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  link: {
    textDecoration: 'none',
  },
};

class Sidebar extends Component {
  toggleDrawer = (open) => () => {
    const { changeVisibleSidebar } = this.props;
    changeVisibleSidebar({ isVisibleSidebar: open });
  };

  render() {
    const { classes, isVisibleSidebar } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {['Связаться с разработчиком'].map((text) => (
            <ListItem button key={text}>
              <ListItemIcon>{<MailIcon />}</ListItemIcon>
              <Link className={classes.link} to={{ pathname: '/feedback' }}>
                <ListItemText className={classes.text} primary={text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div>
        <SwipeableDrawer
          open={isVisibleSidebar}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
        >
          <div className={classes.sidebarHeader}>
            The Tasker
          </div>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Sidebar));