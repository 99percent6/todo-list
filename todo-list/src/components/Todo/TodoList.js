import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uniqueId } from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import BootstrapInput from './BootstrapInput';
import * as actions from '../../core/actions';
import List from './List';
import ListStateTabs from './ListStateTabs';
import { tasksSelector, activeTasksSelector, finishedTasksSelector } from '../../core/selectors';
import '../../css/components/todoList/base.css';

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
  asyncAddTask: actions.asyncAddTask,
  asyncDeleteTask: actions.asyncDeleteTask,
  asyncUpdateTask: actions.asyncUpdateTask,
  syncTasks: actions.syncTasks,
};

class App extends Component {
  componentDidMount () {
    const { syncTasks, token } = this.props;
    if (token) {
      syncTasks({ token });
    }
  }

  valueHandler = (e) => {
    const { target } = e;
    const { value } = target;
    const { updText } = this.props;
    updText({ text: value });
  }

  changedState = (task) => {
    const { asyncUpdateTask, syncTasks, token } = this.props;
    const status = task.state === 'active' ? 'finished' : 'active';
    task = { ...task, state: status };
    asyncUpdateTask({task}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  }

  addTask = (e) => {
    e.preventDefault();
    const { text, asyncAddTask, syncTasks, token } = this.props;
    if (!text) return;
    const task = {
      id: uniqueId(),
      text: text,
      state: 'active',
      createdAt: Date.now(),
    };
    asyncAddTask({ task, token }).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  }

  removeTask = (id) => {
    const { asyncDeleteTask, syncTasks, token } = this.props;
    asyncDeleteTask({id}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  }

  render() {
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
    
    return (
      <div>
        <div className="">
          <div className="inputContainer">
            <FormControl className="">
              <InputLabel htmlFor="age-customized-select" className="">
                Что нужно сделать?
              </InputLabel>
              <BootstrapInput value={this.props.text} onChange={this.valueHandler} />
            </FormControl>
            <Fab onClick={this.addTask} size="medium" color="primary" aria-label="Add" className="addBtn">
              <AddIcon />
            </Fab>
          </div>
        </div>
        <ListStateTabs/>
        <List tasks={actualTasks} onRemove={this.removeTask} onChangeState={this.changedState}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);
