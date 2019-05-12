import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const ITEM_HEIGHT = 30;

const styles = theme => ({
  root: {
    padding: '7px',
  },
  itemText: {
    padding: 0,
  },
});

class ListItemActions extends Component {
  state = {
    anchorEl: null,
  };

  renderActions = () => {
    const { actions, classes } = this.props;
    return actions.map(item => {
      return (
        <MenuItem className={classes.root} key={item.value} selected={false} onClick={() => this.handleAction(item.action)}>
          <ListItemIcon>
            { item.icon }
          </ListItemIcon>
          <ListItemText className={classes.itemText} inset primary={item.label} />
        </MenuItem>
      );
    });
  };

  handleAction = callback => {
    this.handleClose();
    callback();
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div>
        <IconButton
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          { this.renderActions() }
        </Menu>
      </div>
    );
  };
}

export default withStyles(styles)(ListItemActions);