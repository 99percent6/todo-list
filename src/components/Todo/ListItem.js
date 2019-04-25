import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import EventNote from '@material-ui/icons/EventNote';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '80%',
    wordBreak: 'break-all',
  },
  itemContent: {
    cursor: 'pointer',
  },
  avatarBackground: {
    backgroundColor: 'white',
  },
});

class Item extends Component {
  render() {
    const { task, onRemove, onChangeState, classes } = this.props;
    const isActiveState = task.state === 'active';
    const iconColor = isActiveState ? 'action' : 'disabled';

    return (
      <ListItem className={classes.root}>
        <ListItemAvatar>
          <Avatar className={classes.avatarBackground}>
            <EventNote color={iconColor} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          className={classes.itemContent}
          primary={task.text}
          onClick={() => onChangeState(task)}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => onRemove(task.id)} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default withStyles(styles)(Item);