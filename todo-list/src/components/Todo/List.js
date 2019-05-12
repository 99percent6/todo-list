import React, { Component } from 'react';
import Item from './ListItem';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';

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
    const { tasks, onRemove, onChangeState, classes } = this.props;
    if (!tasks || tasks.length === 0) {
      return (
        <div className={classes.textContainer}>
          У вас пока нет ни одной записи, поробуйте это сделать!
        </div>
      );
    } else {
      return tasks.map(task => <Item key={task.id} task={task} onRemove={onRemove} onChangeState={onChangeState} />);
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