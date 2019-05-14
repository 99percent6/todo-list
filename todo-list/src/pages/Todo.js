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
    const { history, match } = props;
    const routeType = match.params && match.params.type;
    const token = getCookie('token');
    const user = getCookie('user');
    
    this.state = {
      value: routeType === 'tasks' ? 0 : 1,
      allowRouteTypes: ['tasks', 'notes'],
    };

    if (!token || !user) {
      history.replace('/');
    }
    if (!routeType || !this.state.allowRouteTypes.includes(routeType)) {
      history.replace('/todo/tasks');
    }
  };

  handleChange = (event, value) => {
    const { history } = this.props;
    history.push({ pathname: `/todo/${value === 1 ? 'notes' : 'tasks'}` });
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