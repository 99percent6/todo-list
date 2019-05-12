import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import EventNote from '@material-ui/icons/EventNote';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../core/actions';
import { priorityList } from '../../helpers';
import DialogEditOptions from '././additional-options/DialogEditOptions';
import ListItemActions from './ListItemActions';
import Date from '../Date';
import '../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { addTask, user } = state;
  const props = {
    token: user.token,
    priority: addTask.priority,
    textValue: addTask.editValue,
    executionDate: addTask.executionDate,
  };
  return props;
};

const actionCreators = {
  updEditValue: actions.updEditValue,
  asyncUpdateTask: actions.asyncUpdateTask,
  syncTasks: actions.syncTasks,
  updPriorityTask: actions.updPriorityTask,
  updPeriodOfExecution: actions.updPeriodOfExecution,
  setNotification: actions.setNotification,
};

const styles = theme => ({
  root: {
    width: '100%',
    wordBreak: 'break-all',
    margin: '5px 0',
    padding: 0,
  },
  itemContentActive: {
    cursor: 'pointer',
    color: 'black',
  },
  itemContentDisabled: {
    cursor: 'pointer',
    color: 'gray',
    textDecoration: 'line-through',
  },
  avatarBackground: {
    backgroundColor: 'white',
    height: '30px',
  },
  input: {
    margin: '0',
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    minHeight: '20px',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
});

class Item extends Component {
  state = {
    isVisibleDialog: false,
    priorityList: priorityList(),
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
        action: () => this.props.onRemove(this.props.task.id),
      },
    ],
  };

  openDialog = () => {
    const { updEditValue, updPriorityTask, updPeriodOfExecution, task } = this.props;
    updEditValue({ text: task.text });
    updPriorityTask({ priority: task.priority ? task.priority : '' });
    updPeriodOfExecution({ executionDate: task.executionDate });
    this.setState({ isVisibleDialog: true });
  };

  closeDialog = () => {
    const { updEditValue, updPriorityTask, updPeriodOfExecution } = this.props;
    updEditValue({ text: '' });
    updPriorityTask({ priority:  '' });
    updPeriodOfExecution({ executionDate: null });
    this.setState({ isVisibleDialog: false });
  }

  applyChanges = (task) => {
    const { textValue, setNotification, asyncUpdateTask, token, syncTasks, priority, executionDate } = this.props;
    if (!textValue || textValue === '') {
      setNotification({ open: true, message: 'Введите название задачи', type: 'error' });
      return;
    }
    task = { ...task, text: textValue, priority, executionDate };
    asyncUpdateTask({task}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
    this.closeDialog();
  };

  buildSecondaryTaskText = (task) => {
    const secondaryData = [
      {
        label: 'Срок исполнения: ',
        value: task.executionDate ? <Date date={task.executionDate} /> : null,
      },
    ];

    return secondaryData.map(item => {
      if (item.value) {
        return (
          <span key={item.label}>
            <span>{ item.label }</span>
            { item.value }
          </span>
        );
      } else {
        return null;
      }
    })
  };

  renderIconGroup = (task) => {
    const { actions } = this.state;
    return <ListItemActions actions={actions}/>
  };

  renderContent = () => {
    const { priorityList } = this.state;
    const { classes, task, onChangeState } = this.props;
    const isActiveState = task.state === 'active';
    const iconColor = isActiveState ? 'action' : 'disabled';
    const secondaryText = this.buildSecondaryTaskText(task);
    const avatar = (
      <ListItemAvatar>
        <Avatar className={classes.avatarBackground}>
          <EventNote color={iconColor} />
        </Avatar>
      </ListItemAvatar>
    );
    const priority = priorityList.find(item => parseInt(item.code) === parseInt(task.priority));
    let divStyle = {};
    if (priority) {
      divStyle = {
        minWidth: '20px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: priority.color,
        margin: '0 10px',
        boxShadow: '2px 3px 10px 0px #726f6f',
      };
    }
    return (
      <div className={classes.contentContainer}>
        { priority ? <div style={divStyle}/> : avatar }
        <div className={classes.contentContainer}>
          <ListItemText
            classes={{
              primary: isActiveState ? classes.itemContentActive : classes.itemContentDisabled,
            }}
            primary={task.text}
            onClick={() => onChangeState(task)}
            secondary={secondaryText}
          />
        </div>
      </div>
    );
  }

  render() {
    const { task, classes } = this.props;
    const { isVisibleDialog } = this.state;

    return (
      <div>
        <ListItem className={classes.root}>
          {this.renderContent()}
          {this.renderIconGroup(task)}
        </ListItem>
        <DialogEditOptions open={isVisibleDialog} onCloseDialog={this.closeDialog} task={task} onSaveTask={() => this.applyChanges(task)}/>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Item));