import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import WorkIcon from '@material-ui/icons/WorkOutline';
import { projectsSelector } from '../../../core/selectors';
import DeleteProjectDialog from './DeleteProjectDialog';

const mapStateToProps = (state) => {
  const props = {
    projectList: projectsSelector(state),
  };
  return props;
};

const styles = () => ({
  root: {
    marginTop: '10px',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  chip: {
    margin: '0 10px 10px 0',
  },
});

class ProjectList extends Component {
  state = {
    activeProject: '',
    idVisibleDialog: null,
  };

  openDialog = (id) => {
    this.setState({ idVisibleDialog: id });
  };

  closeDialog = () => {
    this.setState({ idVisibleDialog: null });
  };

  handleClick = (e, id) => {
    e.preventDefault();
    this.setState({ activeProject: id });
  };

  deleteProject = (id) => {
    const { onDeleteProject } = this.props;
    this.closeDialog();
    onDeleteProject(id);
  };

  renderList = () => {
    const { projectList, classes } = this.props;
    const { activeProject, idVisibleDialog } = this.state;
    if (projectList.length) {
      return projectList.map(project => {
        return (
          <div key={project.id}>
            <Chip
              onClick={(e) => this.handleClick(e, project.id)}
              onDelete={() => this.openDialog(project.id)}
              className={classes.chip}
              color="primary"
              label={project.name}
              variant={activeProject === project.id ? 'default' : 'outlined'}
              icon={<WorkIcon />}
            />
            <DeleteProjectDialog
              projectName={project.name}
              open={idVisibleDialog === project.id}
              onCloseDialog={() => this.closeDialog()}
              onDeleteProject={() => this.deleteProject(project.id)}
            />
          </div>
        );
      })
    } else {
      return null;
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        { this.renderList() }
      </div>
    );
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ProjectList));