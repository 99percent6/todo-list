import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../../core/actions';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    taskDescription: addTask.description,
  };
  return props;
};

const actionCreators = {
  updTaskDescription: actions.updTaskDescription,
};

const styles = theme => ({
  textField: {
    marginTop: '10px',
  },
});

class TaskDescription extends Component {
  handleChange = (event) => {
    const { value } = event.target;
    const { updTaskDescription } = this.props;
    updTaskDescription({ description: value });
  }

  render() {
    const { taskDescription, classes } = this.props;

    return (
      <div className="col-xs-12 col-sm-6 col-md-4">
        <TextField
          id="standard-multiline-flexible"
          label="Описание"
          multiline
          rowsMax="4"
          value={taskDescription}
          onChange={this.handleChange}
          className={classes.textField}
          margin="normal"
        />
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(TaskDescription));