import React, { Component } from 'react';
import Item from './ListItem';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { withSyncTask } from '../../core/hoc/withSyncTask';
import { withEditTask } from '../../core/hoc/withEditTask';

const ListItemWithEditTask = withSyncTask(withEditTask(Item));

const styles = {
  textContainer: {
    margin: '10px',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
};

class TodoList extends Component {
  renderTasks() {
    const { tasks, onChangeState, classes } = this.props;
    if (!tasks || tasks.length === 0) {
      return (
        <div className={classes.textContainer}>
          Пока нет ни одной записи, поробуйте это сделать!
        </div>
      );
    } else {
      return tasks.map(task => <ListItemWithEditTask key={task.id} task={task} onChangeState={onChangeState} />);
    }
  }

  render () {
    return (
      <div>
        <List>
          { this.renderTasks() }
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(TodoList);