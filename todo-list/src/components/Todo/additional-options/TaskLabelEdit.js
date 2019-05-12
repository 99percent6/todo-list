import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../../core/actions';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    taskLabel: addTask.editValue,
  };
  return props;
};

const actionCreators = {
  updEditValue: actions.updEditValue,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing(),
  },
  textField: {
    width: '100%',
    margin: '10px 0',
  },
});

class TaskLabelEdit extends Component {
  handleChange = (event) => {
    const { value } = event.target;
    const { updEditValue } = this.props;
    updEditValue({ text: value });
  };

  render() {
    const { classes, taskLabel } = this.props;

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor="task-label">Задача</InputLabel>
        <Input
          id="task-label"
          type='text'
          value={taskLabel}
          onChange={this.handleChange}
        />
      </FormControl>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(TaskLabelEdit));