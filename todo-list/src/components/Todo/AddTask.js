import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../core/actions';
import AddTaskAdditionalOpts from './AddTaskAdditionalOpts';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import { uniqueId } from 'lodash';
import '../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { addTask, user } = state;
  const props = {
    textValue: addTask.value,
    priority: addTask.priority,
    executionDate: addTask.executionDate,
    project: addTask.project,
    token: user.token,
  };
  return props;
};

const actionCreators = {
  updText: actions.updText,
  asyncAddTask: actions.asyncAddTask,
};

const styles = theme => ({
  textField: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: theme.spacing(),
    marginRight: '20px',
  },
});

class AddTask extends Component {
  handleKeyPress = (e) => {
    const event = e;
    if (event.key === 'Enter') {
      this.addTask(event);
    }
  };

  valueHandler = (e) => {
    const { target } = e;
    const { value } = target;
    const { updText } = this.props;
    updText({ text: value });
  };

  addTask = (e) => {
    e.preventDefault();
    const { textValue, priority, executionDate, project, asyncAddTask, syncTasks, token } = this.props;
    if (!textValue || textValue.trim() === '') return;
    const task = {
      id: uniqueId(),
      text: textValue,
      state: 'active',
      priority,
      executionDate,
      project,
    };
    asyncAddTask({ task, token }).then(res => {
      if (token) {
        syncTasks();
      }
    });
  };

  render() {
    const { classes, textValue } = this.props;

    return (
      <div>
        <div className="input-container">
          <FormControl className="">
            <TextField
              id="outlined-name"
              label="Что нужно сделать?"
              className={classes.textField}
              value={textValue}
              onChange={this.valueHandler}
              onKeyPress={this.handleKeyPress}
              margin="normal"
              variant="outlined"
            />
          </FormControl>
          <Fab onClick={this.addTask} size="medium" color="secondary" aria-label="Add" className="">
            <AddIcon />
          </Fab>
        </div>
        <AddTaskAdditionalOpts/>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(AddTask));