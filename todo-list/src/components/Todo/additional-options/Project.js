import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../core/actions';
import { projectsSelector } from '../../../core/selectors';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import '../../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    project: addTask.project,
    projectList: projectsSelector(state),
  };
  return props;
};

const actionCreators = {
  updProjectTask: actions.updProjectTask,
};

const styles = theme => ({
  formControl: {
    minWidth: 200,
  },
});

class SelectProject extends Component {
  renderMenuItem = () => {
    const { projectList } = this.props;
    return projectList.map(item => {
      return (
        <MenuItem key={item.id} value={item}>
          {item.name}
        </MenuItem>
      )
    })
  };

  handleChange = event => {
    const { updProjectTask } = this.props;
    updProjectTask({ project: event.target.value });
  };

  render() {
    const { classes, project } = this.props;

    return (
      <div className="additional-options">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="project">Проект</InputLabel>
          <Select
            value={project}
            renderValue={value => value.name}
            onChange={this.handleChange}
            name="project"
            input={<Input id="project" />}
          >
            { this.renderMenuItem() }
          </Select>
        </FormControl>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(SelectProject));