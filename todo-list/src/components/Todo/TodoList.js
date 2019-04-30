import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uniqueId } from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import BootstrapInput from './BootstrapInput';
import * as actions from '../../core/actions';
import { db } from '../../core/db';
import List from './List';
import ListStateTabs from './ListStateTabs';
import { tasksSelector, activeTasksSelector, finishedTasksSelector } from '../../core/selectors';
import '../../css/components/todoList/base.css';

const mapStateToProps = (state) => {
  const { text, UIState } = state;
  const props = {
    text,
    tasks: tasksSelector(state),
    activeTasks: activeTasksSelector(state),
    finishedTasks: finishedTasksSelector(state),
    UIState,
  };
  return props;
}

const actionCreators = {
  updText: actions.updText,
  delTask: actions.delTask,
  updTask: actions.updTask,
  updTaskState: actions.updTaskState,
  replaceTasks: actions.replaceTasks,
  asyncAddTask: actions.asyncAddTask,
};

class App extends Component {
  componentDidMount () {
    this.syncTasks();
  }

  syncTasks () {
    const { replaceTasks } = this.props;
    let tasks = {};
    db.collection(window.dbCollectionName).orderBy('createdAt', 'desc').get().then(result => {
      result.docs.forEach(doc => {
        const data = doc.data();
        Object.assign(data, { id: doc.id });
        Object.assign(tasks, {
          [data.id]: data,
        });
      });
      replaceTasks({tasks});
    });
  }

  valueHandler = (e) => {
    const { target } = e;
    const { value } = target;
    const { updText } = this.props;
    updText({ text: value });
  }

  changedState = (task) => {
    const { updTaskState } = this.props;
    updTaskState({task});
  }

  addTask = (e) => {
    e.preventDefault();
    const { text, asyncAddTask } = this.props;
    if (!text) return;
    const task = {
      id: uniqueId(),
      text: text,
      state: 'active',
      createdAt: Date.now(),
    };
    asyncAddTask(task).then(res => {
      this.syncTasks();
    });
  }

  removeTask = (id) => {
    const { delTask } = this.props;
    delTask({id});
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
