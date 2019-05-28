import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddProjectBtn from './AddProjectBtn';
import AddProjectDialog from './AddProjectDialog';
import ProjectList from './ProjectList';
import * as actions from '../../../core/actions';
import { uniqueId } from 'lodash';
import { slugify } from '../../../helpers';
import { withSyncTask } from '../../../core/hoc/withSyncTask';
import '../../../css/components/todoList/base.scss';

const ProjectListWithSyncTask = withSyncTask(ProjectList);

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
  asyncDeleteTasksByProject: actions.asyncDeleteTasksByProject,
  getProjects: actions.getProjects,
  syncTasks: actions.syncTasks,
};

const styles = theme => ({
  root: {
    boxSizing: 'border-box',
    width: '100%',
    marginBottom: '20px',
    padding: '0 10px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
    const { projectName, createProject, token, getProjects } = this.props;
    if (!projectName) {
      return;
    }
    const project = {
      name: projectName,
      id: uniqueId(),
      slug: slugify(projectName),
    };
    createProject({ project }).then(res => {
      if (token) {
        getProjects({ token });
      }
    });
    this.closeDialog();
  };

  deleteProject = (id) => {
    const { asyncDeleteProject, asyncDeleteTasksByProject, getProjects, syncTasks, token, history } = this.props;
    asyncDeleteTasksByProject({ projectId: id }).then(res => {
      asyncDeleteProject({ id }).then(res => {
        if (token) {
          syncTasks({ token });
          getProjects({ token });
          history.replace({ pathname: '/todo/tasks/all' })
        }
      });
    })
  };

  render() {
    const { classes } = this.props;
    const { isVisibleDialog } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading} variant="caption">Проекты</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="options-container">
            <AddProjectBtn openDialog={this.openDialog}/>
            <ProjectListWithSyncTask onDeleteProject={this.deleteProject}/>
            <AddProjectDialog
              open={isVisibleDialog}
              onSaveProject={this.createProject}
              onCloseDialog={this.closeDialog}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  };
}

export default withRouter(connect(mapStateToProps, actionCreators)(withStyles(styles)(Projects)));