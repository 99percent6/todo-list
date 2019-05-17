import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import WorkIcon from '@material-ui/icons/WorkOutline';
import { projectsSelector } from '../../../core/selectors';

const mapStateToProps = (state) => {
  const props = {
    projectList: projectsSelector(state),
  };
  return props;
};

const styles = () => ({
  root: {
    marginTop: '10px',
  },
  chip: {
    margin: '0 10px 10px 0',
  },
});

class ProjectList extends Component {
  state = {
    activeProject: '',
  };

  handleClick = (e, id) => {
    e.preventDefault();
    this.setState({ activeProject: id });
  };

  renderList = () => {
    const { projectList, classes } = this.props;
    const { activeProject } = this.state;
    if (projectList.length) {
      return projectList.map(project => {
        return (
          <Chip
            key={project.id}
            onClick={(e) => this.handleClick(e, project.id)}
            className={classes.chip}
            color="primary"
            label={project.name}
            variant={activeProject === project.id ? 'default' : 'outlined'}
            icon={<WorkIcon />}
          />
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