import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../core/actions';
import List from './List';
import AddTask from './AddTask';
import ListStateTabs from './ListStateTabs';
import { tasksSelector, activeTasksSelector, finishedTasksSelector } from '../../core/selectors';
import '../../css/components/todoList/base.scss';

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
  asyncDeleteTask: actions.asyncDeleteTask,
  asyncUpdateTask: actions.asyncUpdateTask,
  syncTasks: actions.syncTasks,
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
    const { syncTasks, token } = this.props;
    if (token) {
      syncTasks({ token });
    }
  };

  changedState = (task) => {
    const { asyncUpdateTask, syncTasks, token } = this.props;
    const status = task.state === 'active' ? 'finished' : 'active';
    task = { ...task, state: status };
    asyncUpdateTask({task}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  };

  removeTask = (id) => {
    const { asyncDeleteTask, syncTasks, token } = this.props;
    asyncDeleteTask({id}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  };

  renderList = () => {
    const { tasks, UIState, activeTasks, finishedTasks } = this.props;
    let actualTasks = [];

    switch (UIState.activeTaskTable) {
      case 'active':
        actualTasks = activeTasks;
        break;
      case 'finished':
        actualTasks = finishedTasks;
        break;
      default:
        actualTasks = tasks;
        break;
    }

    return <List tasks={actualTasks} onRemove={this.removeTask} onChangeState={this.changedState}/>;
  }

  render() {
    return (
      <div>
        <div>
          <AddTask/>
        </div>
        <ListStateTabs/>
        { this.renderList() }
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(App));
