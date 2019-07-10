import React, { Component } from 'react';
import Item from './ListItem';
import List from '@material-ui/core/List';
import Sort from './Sort';
import { withStyles } from '@material-ui/core/styles';
import { withSyncTask } from '../../core/hoc/withSyncTask';
import { withEditTask } from '../../core/hoc/withEditTask';

const ListItemWithEditTask = withSyncTask(withEditTask(Item));
const SortWithSyncTask = withSyncTask(Sort);

const styles = {
  textContainer: {
    margin: '10px',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingTop: 0,
  },
  sortContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 12px',
  },
};

class TodoList extends Component {
  renderTasks() {
    const { tasks, classes } = this.props;
    if (!tasks || tasks.length === 0) {
      return (
        <div className={classes.textContainer}>
          Пока нет ни одной записи, поробуйте это сделать!
        </div>
      );
    } else {
      return (
        <div>
          <div className={classes.sortContainer}>
            <SortWithSyncTask/>
          </div>
          { tasks.map(task => <ListItemWithEditTask key={task.id} task={task}/>) }
        </div>
      );
    }
  }

  render () {
    const { classes } = this.props;

    return (
      <div>
        <List className={classes.listContainer}>
          { this.renderTasks() }
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(TodoList);