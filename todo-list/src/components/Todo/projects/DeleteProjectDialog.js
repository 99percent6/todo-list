import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  paperFullWidth: {
    margin: '10px',
  },
  title: {
    wordBreak: 'break-all',
  },
});

class DeleteProjectDialog extends Component {
  static defaultProps = {
    maxWidth: 'sm',
    fullWidth: true,
  };

  render() {
    const { classes, maxWidth, fullWidth, open, onCloseDialog, onDeleteProject, projectName } = this.props;

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
          <DialogTitle id="max-width-dialog-title" className={classes.title}>{projectName}</DialogTitle>
          <DialogContent>
            <div className="options-container">
              Вы уверены, что хотите удалить проект и все связанные с ним задачи?
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onDeleteProject()} color="primary">
              Удалить
            </Button>
            <Button onClick={onCloseDialog} color="secondary">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  };
}

export default withStyles(styles)(DeleteProjectDialog);