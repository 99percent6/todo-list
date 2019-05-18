import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AddProjectBtn from './AddProjectBtn';
import AddProjectDialog from './AddProjectDialog';
import ProjectList from './ProjectList';
import * as actions from '../../../core/actions';
import { uniqueId } from 'lodash';
import { slugify } from '../../../helpers';

const mapStateToProps = (state) => {
  const { project, user } = state;
  const props = {
    projectName: project.name,
    projectList: project.list,
    token: user.token,
  };
  return props;
};

const actionCreators = {
  createProject: actions.createProject,
  asyncDeleteProject: actions.asyncDeleteProject,
  getProjects: actions.getProjects,
};

const styles = theme => ({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    marginBottom: '20px',
    padding: '0 24px',
  },
});

class Projects extends Component {
  state = {
    isVisibleDialog: false,
  };

  openDialog = () => {
    this.setState({ isVisibleDialog: true });
  };

  closeDialog = () => {
    this.setState({ isVisibleDialog: false });
  };

  createProject = () => {
    const { projectName, createProject } = this.props;
    const project = {
      name: projectName,
      id: uniqueId(),
      slug: slugify(projectName),
    };
    createProject({ project });
    this.closeDialog();
  };

  deleteProject = (id) => {
    const { asyncDeleteProject, getProjects, token } = this.props;
    asyncDeleteProject({ id }).then(res => {
      if (token) {
        getProjects({ token });
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { isVisibleDialog } = this.state;

    return (
      <div className={classes.root}>
        <AddProjectBtn openDialog={this.openDialog}/>
        <ProjectList onDeleteProject={this.deleteProject}/>
        <AddProjectDialog
          open={isVisibleDialog}
          onSaveProject={this.createProject}
          onCloseDialog={this.closeDialog}
        />
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Projects));