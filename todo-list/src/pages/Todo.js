import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Todo from '../components/Todo/TodoList';
import TabContainer from '../components/Tabs/TabContainer';
import { getCookie } from '../core/lib/cookies';

const styles = theme => ({
  root: {
    margin: '0 auto',
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1000,
  },
});

class TodoTabs extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const token = getCookie('token');
    let user = getCookie('user');
    if (!token || !user) {
      history.replace('/');
    }
  }

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Задачи" />
            <Tab label="Заметки" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <Todo />
          </TabContainer>
          <TabContainer dir={theme.direction}>В разработке...</TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(TodoTabs);