import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import EventNote from '@material-ui/icons/EventNote';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import * as actions from '../../core/actions';

const mapStateToProps = (state) => {
  const { token } = state.user;
  const props = {
    token,
  };
  return props;
};

const styles = theme => ({
  root: {
    width: '80%',
    wordBreak: 'break-all',
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
  },
  input: {
    margin: theme.spacing.unit,
  },
});

const actionCreators = {
  asyncUpdateTask: actions.asyncUpdateTask,
  syncTasks: actions.syncTasks,
};

class Item extends Component {
  state = {
    isEdit: false,
    newText: '',
  }

  editTask = (text, isEdit) => {
    this.setState({
      isEdit,
      newText: text,
    });
  }

  applyChanges = (task) => {
    const { newText } = this.state;
    const { asyncUpdateTask, token, syncTasks } = this.props;
    task = { ...task, text: newText };
    this.editTask('', false);
    asyncUpdateTask({task}).then(res => {
      if (token) {
        syncTasks({ token });
      }
    });
  }

  renderIconGroup = (task) => {
    const { isEdit } = this.state;
    const { onRemove } = this.props;
    if (isEdit) {
      return (
        <ListItemSecondaryAction>
          <IconButton onClick={() => this.applyChanges(task)} aria-label="Delete">
            <DoneIcon />
          </IconButton>
          <IconButton onClick={() => this.editTask('', false)} aria-label="Delete">
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      );
    } else {
      return (
        <ListItemSecondaryAction>
          <IconButton onClick={() => this.editTask(task.text, true)} aria-label="Delete">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onRemove(task.id)} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      );
    }
  }

  handleChange = (event) => {
    event.preventDefault();
    const { value } = event.target;
    this.setState({ newText: value });
  }

  render() {
    const { task, onChangeState, classes } = this.props;
    const { newText, isEdit } = this.state;
    const isActiveState = task.state === 'active';
    const iconColor = isActiveState ? 'action' : 'disabled';

    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar className={classes.avatarBackground}>
            <EventNote color={iconColor} />
          </Avatar>
        </ListItemAvatar>
        {!isEdit &&
          <ListItemText
            classes={{
              primary: isActiveState ? classes.itemContentActive : classes.itemContentDisabled,
            }}
            primary={task.text}
            onClick={() => onChangeState(task)}
          />
        }
        {isEdit &&
          <Input
          defaultValue={newText}
          className={classes.input}
          onChange={this.handleChange}
          inputProps={{
            'aria-label': 'Description',
          }}
        />
        }
        {this.renderIconGroup(task)}
      </ListItem>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Item));