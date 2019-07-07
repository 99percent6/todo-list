import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { priorityList } from '../../../helpers';
import MatrixItem from './MatrixItem';
import { withSyncTask } from '../../../core/hoc/withSyncTask';
import { withEditTask } from '../../../core/hoc/withEditTask';
import '../../../css/components/todoList/base.scss';

const MatrixItemWithEditTask = withSyncTask(withEditTask(MatrixItem));

const styles = {
  textContainer: {
    margin: '10px',
    padding: '8px 0',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
};

class Matrix extends Component {
  state = {
    priorityLabels: {
      0: {
        label: 'Срочно',
        class: 'label-container label-urgently'
      },
      1: {
        label: 'Важно',
        class: 'label-container label-important'
      },
      2: {
        label: 'Не важно',
        class: 'label-container label-not-important'
      },
      3: {
        label: 'Не срочно',
        class: 'label-container label-not-urgently'
      },
    },
  };

  renderMatrix = () => {
    const { tasks } = this.props;
    const { priorityLabels } = this.state;

    return (
      priorityList().map((item, index) => {
        return (
          <div key={item.code} className="matrix-block">
            <div className="title">{ item.value }</div>
            { tasks.filter(task => task.priority === item.code).map(task => {
              const taskStyle = {
                backgroundColor: item.color,
                color: 'white',
                fontWeight: '500',
                display: 'inline-block',
                padding: '5px 10px',
                marginBottom: '5px',
                marginRight: '5px',
                borderRadius: '5px',
                boxShadow: 'rgb(114, 111, 111) 2px 3px 10px 0px',
                cursor: 'pointer',
              }

              return (
                <MatrixItemWithEditTask key={task.id} taskStyle={taskStyle} task={task}/>
              );
            }) }
            <div className={priorityLabels[index].class}>
              <div className="label">{priorityLabels[index].label}</div>
            </div>
          </div>
        );
      })
    );
  };

  render() {
    const { tasks, classes } = this.props;

    if (tasks && tasks.length) {
      return (
        <div className="matrix-container">
          { this.renderMatrix() }
        </div>
      );
    } else {
      return (
        <div className={classes.textContainer}>
          Пока нет ни одной записи, поробуйте это сделать!
        </div>
      );
    }
  };
}

export default withStyles(styles)(Matrix);