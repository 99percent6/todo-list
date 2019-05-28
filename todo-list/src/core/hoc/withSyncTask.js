import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../actions';
import { projectsSelector } from '../selectors';

export function withSyncTask(WrappedComponent) {
  const mapStateToProps = (state) => {
    const { user } = state;
    const props = {
      token: user.token,
      projectList: projectsSelector(state),
    };
    return props;
  }
  
  const actionCreators = {
    asyncSyncTasks: actions.syncTasks,
  };

  class WithSyncTask extends Component {
    withSyncTasks = (projectSlug = null) => {
      const { token, projectList, match, asyncSyncTasks } = this.props;
      if (token) {
        const currentProjectSlug = projectSlug || (match && match.params && match.params.project);
        if (currentProjectSlug === 'all') {
          asyncSyncTasks({ token });
        } else {
          const currentProject = projectList.find(project => project.slug === currentProjectSlug);
          const currentProjectId = currentProject && currentProject.id;
          asyncSyncTasks({ token, field: 'project.id', value: currentProjectId });
        }
      }
    };

    render() {
      return <WrappedComponent syncTasks={this.withSyncTasks} test="test" {...this.props} />;
    };
  };

  return withRouter(connect(mapStateToProps, actionCreators)(WithSyncTask));
}