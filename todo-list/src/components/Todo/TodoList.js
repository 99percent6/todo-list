import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../core/actions';
import List from './List';
import AddTask from './AddTask';
import ListStateTabs from './ListStateTabs';
import { tasksSelector, activeTasksSelector, finishedTasksSelector } from '../../core/selectors';
import Loader from '../Loader';
import Projects from './projects/Projects';
import Matrix from './matrix/Matrix';
import '../../css/components/todoList/base.scss';
import { withSyncTask } from '../../core/hoc/withSyncTask';

const AddTaskWithSyncTask = withSyncTask(AddTask);

const mapStateToProps = (state) => {
  const { text, UIState, user } = state;
  const props = {
    text,
    tasks: tasksSelector(state),
    activeTasks: activeTasksSelector(state),
    finishedTasks: finishedTasksSelector(state),
    UIState,
    token: user.token,
  };
  return props;
}

const actionCreators = {
  updText: actions.updText,
  delTask: actions.delTask,
  updTask: actions.updTask,
  replaceTasks: actions.replaceTasks,
  asyncUpdateTask: actions.asyncUpdateTask,
  getProjects: actions.getProjects,
};

const styles = theme => ({
  textField: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.spacing(),
    marginRight: '20px',
  },
  loaderContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
});

class App extends Component {
  componentDidMount () {
    const { getProjects, token, syncTasks } = this.props;
    if (token) {
      getProjects({ token }).then(res => {
        syncTasks();
      });
    }
  };

  changedState = (task) => {
    const { asyncUpdateTask, syncTasks } = this.props;
    const status = task.state === 'active' ? 'finished' : 'active';
    task = { ...task, state: status };
    asyncUpdateTask({task}).then(res => {
      syncTasks();
    });
  };

  renderList = () => {
    const { tasks, UIState, activeTasks, finishedTasks, classes } = this.props;
    let actualTasks = [];

    switch (UIState.activeTaskTable) {
      case 'active':
        actualTasks = activeTasks;
        break;
      case 'finished':
        actualTasks = finishedTasks;
        break;
      case 'matrix':
        actualTasks = activeTasks;
        break;
      default:
        actualTasks = tasks;
        break;
    }

    if (UIState.syncTasksState === 'request' && actualTasks.length === 0) {
      return (
        <div className={classes.loaderContainer}>
          <Loader/>
        </div>
      );
    } else if (UIState.activeTaskTable === 'matrix') {
      return <Matrix tasks={actualTasks}/>;
    } else {
      return <List tasks={actualTasks} onChangeState={this.changedState}/>;
    }
  }

  render() {
    return (
      <div>
        <div>
          <Projects/>
          <AddTaskWithSyncTask/>
        </div>
        <ListStateTabs/>
        { this.renderList() }
      </div>
    );
  };
}

export default withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(App)));
