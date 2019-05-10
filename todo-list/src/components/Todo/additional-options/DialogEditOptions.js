import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Priority from './Priority';
import TaskLabelEdit from './TaskLabelEdit';

const mapStateToProps = () => {
  const props = {};
  return props;
};

const styles = theme => ({
  paperFullWidth: {
    margin: '10px',
  },
});

class DialogEditOptions extends Component {
  static defaultProps = {
    maxWidth: 'md',
    fullWidth: true,
  };

  render() {
    const { maxWidth, fullWidth, open, onCloseDialog, onSaveTask, task, classes } = this.props;

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
          <DialogTitle id="max-width-dialog-title">{ task.text }</DialogTitle>
          <DialogContent>
            <TaskLabelEdit/>
            <Priority/>
          </DialogContent>
          <DialogActions>
            <Button onClick={onSaveTask} color="primary">
              Сохранить
            </Button>
            <Button onClick={onCloseDialog} color="secondary">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(DialogEditOptions));