import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uniqueId } from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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

const styles = theme => ({
  textField: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.spacing.unit,
    marginRight: '20px',
  },
});

class App extends Component {
  componentDidMount () {
    const { syncTasks, token } = this.props;
    if (token) {
      syncTasks({ token });
    }
  }

  handleKeyPress = (e) => {
    const event = e;
    if (event.key === 'Enter') {
      this.addTask(event);
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
    if (!text || text.trim() === '') return;
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
    const { tasks, UIState, activeTasks, finishedTasks, classes, text } = this.props;
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
        <div>
          <div className="inputContainer">
            <FormControl className="">
              <TextField
                id="outlined-name"
                label="Что нужно сделать?"
                className={classes.textField}
                value={text}
                onChange={this.valueHandler}
                onKeyPress={this.handleKeyPress}
                margin="normal"
                variant="outlined"
              />
            </FormControl>
            <Fab onClick={this.addTask} size="medium" color="primary" aria-label="Add" className="">
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

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(App));
