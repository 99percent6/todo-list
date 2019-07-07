import React, { Component } from 'react';
import PopupMenu from './PopupMenu';
import DialogEditOptions from '../additional-options/DialogEditOptions';

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
    const { task, taskStyle, closeDialog, applyChanges, isVisibleDialog, actions } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <div style={taskStyle} onClick={this.handleClickPopupMenu}>{ task.text }</div>
        <PopupMenu anchorEl={anchorEl} actions={actions} handleClose={this.handleClosePopupMenu}/>
        <DialogEditOptions open={isVisibleDialog} onCloseDialog={closeDialog} task={task} onSaveTask={() => applyChanges(task)}/>
      </div>
    );
  };
}

export default MatrixItem;