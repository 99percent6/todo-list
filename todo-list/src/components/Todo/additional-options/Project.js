import React, { Component } from 'react';
import { connect } from 'react-redux';
// import * as actions from '../../../core/actions';
import { projectsSelector } from '../../../core/selectors';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import '../../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const props = {
    projectList: projectsSelector(state),
  };
  return props;
};

const actionCreators = {};

const styles = theme => ({
  formControl: {
    minWidth: 200,
  },
});

class SelectProject extends Component {
  componentDidUpdate(prevProps) {
    const { projectList, match } = this.props;
    if (match.params.project && (projectList.length !== prevProps.projectList.length || match.params.project !== prevProps.match.params.project)) {
      this.setProject(match.params.project);
    }
  };

  setProject = (value) => {
    const { updProjectTask, projectList } = this.props;
    const project = value === 'all' ? '' : projectList.find(itm => itm.slug === value);
    updProjectTask({ project });
  };

  renderMenuItem = () => {
    const { projectList } = this.props;
    return projectList.filter(item => item.slug !== 'all').map(item => {
      return (
        <MenuItem key={item.id} value={item}>
          {item.name}
        </MenuItem>
      );
    });
  };

  handleChange = event => {
    this.setProject(event.target.value.slug);
  };

  render() {
    const { classes, project } = this.props;

    return (
      <div className="additional-options col-xs-12 col-sm-6 col-md-4">
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

export default withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(SelectProject)));