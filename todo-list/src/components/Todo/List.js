import React, { Component } from 'react';
import Item from './ListItem';
import List from '@material-ui/core/List';

class TodoList extends Component {
  renderTasks() {
    const { tasks, onRemove, onChangeState } = this.props;
    if (!tasks || tasks.length === 0) return null;
    return tasks.map(task => <Item key={task.id} task={task} onRemove={onRemove} onChangeState={onChangeState} />);
  }

  render () {
    return (
      <div>
        <List>
          {this.renderTasks()}
        </List>
      </div>
    );
  }
}

export default TodoList;