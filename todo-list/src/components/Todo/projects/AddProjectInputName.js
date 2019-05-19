import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import * as actions from '../../../core/actions';

const mapStateToProps = (state) => {
  const { project } = state;
  const props = {
    projectName: project.name,
  };
  return props;
};

const actionCreators = {
  updProjectName: actions.updProjectName,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: '100%',
    margin: '10px 0',
  },
});

class AddProjectInputLabel extends Component {
  handleKeyPress = (e) => {
    const event = e;
    const { onSaveProject } = this.props;
    if (event.key === 'Enter') {
      onSaveProject();
    }
  };

  handleChange = (event) => {
    const { value } = event.target;
    const { updProjectName } = this.props;
    updProjectName({ name: value });
  };

  render() {
    const { classes, projectName } = this.props;

    return (
      <FormControl className={classNames(classes.margin, classes.textField)}>
        <InputLabel htmlFor="project-name">Проект</InputLabel>
        <Input
          id="project-name"
          type='text'
          value={projectName}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </FormControl>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(AddProjectInputLabel));