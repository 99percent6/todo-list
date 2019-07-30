import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../core/actions';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Priority from './Priority';
import TaskLabelEdit from './TaskLabelEdit';
import PeriodOfExecution from './PeriodOfExecution';
import Project from './Project';
import TaskDescription from './Description';
import '../../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    project: addTask.editProject,
  };
  return props;
};

const actionCreators = {
  updEditProjectTask: actions.updEditProjectTask,
};

const styles = theme => ({
  paperFullWidth: {
    width: '100%',
    margin: '0',
  },
  title: {
    wordBreak: 'break-all',
  },
  dialogActionsRoot: {
    flex: '0 0 auto',
    display: 'flex',
    padding: '8px 24px',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

class DialogEditOptions extends Component {
  static defaultProps = {
    maxWidth: 'md',
    fullWidth: true,
  };

  render() {
    const { maxWidth, fullWidth, open, onCloseDialog, onSaveTask, task, classes, onChangedState, updEditProjectTask, project } = this.props;

    return (
      <React.Fragment>
        <Dialog
          classes={{
            paperFullWidth: classes.paperFullWidth
          }}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={onCloseDialog}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title" className={classes.title}>{ task.text }</DialogTitle>
          <DialogContent>
            <TaskLabelEdit/>
            <div className="options-container row between-xs">
              <Priority/>
              <PeriodOfExecution/>
              <Project project={project} updProjectTask={updEditProjectTask}/>
              <TaskDescription/>
            </div>
          </DialogContent>
          <DialogActions classes={{root: classes.dialogActionsRoot}}>
            <div>
              <Button onClick={onChangedState} color="primary">
                { task.state === 'active' ? 'Сделано' : 'Вернуть' }
              </Button>
            </div>
            <div>
              <Button onClick={onSaveTask} color="primary">
                Сохранить
              </Button>
              <Button onClick={onCloseDialog} color="secondary">
                Закрыть
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(DialogEditOptions));