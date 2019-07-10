import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

class PopupMenu extends Component {
  renderActions = () => {
    const { actions } = this.props;
    const icon = (action) => {
      if (action.icon) {
        return (
          <ListItemIcon>
            { action.icon }
          </ListItemIcon>
        );
      }
      return null;
    }

    return actions.map(action => {
      return (
        <StyledMenuItem key={action.value} onClick={() => this.handleAction(action.action)}>
          { icon(action) }
          <ListItemText primary={action.label} />
        </StyledMenuItem>
      )
    })
  };

  handleAction = callback => {
    const { handleClose } = this.props;
    handleClose();
    callback();
  };

  render() {
    const { anchorEl, handleClose } = this.props;

    return (
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {this.renderActions()}
      </StyledMenu>
    );
  };
}

export default PopupMenu;