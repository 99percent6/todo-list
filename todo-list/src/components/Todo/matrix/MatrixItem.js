import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PopupMenu from './PopupMenu';
import DialogEditOptions from '../additional-options/DialogEditOptions';

const styles = {
  itemContainer: {
    display: 'inline-flex',
  },
};

class MatrixItem extends Component {
  state = {
    anchorEl: null,
  };

  handleClickPopupMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClosePopupMenu = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { task, taskStyle, closeDialog, applyChanges, isVisibleDialog, actions, classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={classes.itemContainer}>
        <div style={taskStyle} onClick={this.handleClickPopupMenu}>{ task.text }</div>
        <PopupMenu anchorEl={anchorEl} actions={actions} handleClose={this.handleClosePopupMenu}/>
        <DialogEditOptions open={isVisibleDialog} onCloseDialog={closeDialog} task={task} onSaveTask={() => applyChanges(task)}/>
      </div>
    );
  };
}

export default withStyles(styles)(MatrixItem);