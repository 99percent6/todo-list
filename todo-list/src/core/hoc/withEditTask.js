import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export function withEditTask(WrappedComponent) {
  const mapStateToProps = (state) => {
    const { addTask, user } = state;
    const props = {
      token: user.token,
      priority: addTask.priority,
      textValue: addTask.editValue,
      executionDate: addTask.executionDate,
      project: addTask.project,
    };
    return props;
  }
  
  const actionCreators = {
    updEditValue: actions.updEditValue,
    asyncUpdateTask: actions.asyncUpdateTask,
    updPriorityTask: actions.updPriorityTask,
    updPeriodOfExecution: actions.updPeriodOfExecution,
    updProjectTask: actions.updProjectTask,
    setNotification: actions.setNotification,
    asyncDeleteTask: actions.asyncDeleteTask,
  };

  class WithEditTask extends Component {
    state = {
      isVisibleDialog: false,
      actions: [
        {
          label: 'Редактировать',
          value: 'edit',
          icon: <EditIcon/>,
          action: () => this.openDialog(),
        },
        {
          label: 'Удалить',
          value: 'delete',
          icon: <DeleteIcon/>,
          action: () => this.removeTask(this.props.task.id),
        },
      ],
    };

    openDialog = () => {
      const { updEditValue, updPriorityTask, updPeriodOfExecution, updProjectTask, task } = this.props;
      updEditValue({ text: task.text });
      updPriorityTask({ priority: task.priority ? task.priority : '' });
      updPeriodOfExecution({ executionDate: task.executionDate ? task.executionDate : null });
      updProjectTask({ project: task.project ? task.project : '' });
      this.setState({ isVisibleDialog: true });
    };
  
    closeDialog = () => {
      const { updEditValue, updPriorityTask, updPeriodOfExecution, updProjectTask } = this.props;
      updEditValue({ text: '' });
      updPriorityTask({ priority:  '' });
      updPeriodOfExecution({ executionDate: null });
      updProjectTask({ project: '' });
      this.setState({ isVisibleDialog: false });
    };
  
    removeTask = (id) => {
      const { asyncDeleteTask, syncTasks } = this.props;
      asyncDeleteTask({id}).then(res => {
        syncTasks();
      });
    };
  
    applyChanges = (task) => {
      const { textValue, setNotification, asyncUpdateTask, token, syncTasks, priority, executionDate, project } = this.props;
      if (!textValue || textValue === '') {
        setNotification({ open: true, message: 'Введите название задачи', type: 'error' });
        return;
      }
      task = { ...task, text: textValue, priority, executionDate, project };
      asyncUpdateTask({task}).then(res => {
        if (token) {
          syncTasks();
        }
      });
      this.closeDialog();
    };

    render() {
      const { isVisibleDialog, actions } = this.state;

      return (
        <WrappedComponent
          openDialog={this.openDialog}
          closeDialog={this.closeDialog}
          removeTask={this.removeTask}
          applyChanges={this.applyChanges}
          isVisibleDialog={isVisibleDialog}
          actions={actions}
          {...this.props}
        />
      );
    };
  };

  return connect(mapStateToProps, actionCreators)(WithEditTask);
};