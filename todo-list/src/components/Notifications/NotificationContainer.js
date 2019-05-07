import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import NotificationContent from './NotificationContent';
import * as actions from '../../core/actions';

const mapStateToProps = (state) => {
  const { open, message, type } = state.notifications;
  const props = {
    openNotification: open,
    notificationMessage: message,
    notificationType: type,
  };
  return props;
};

const actionCreators = {
  setNotificationState: actions.setNotificationState,
};

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});

class NotificationContainer extends Component {
  handleClose = (event, reason) => {
    const { setNotificationState } = this.props;

    if (reason === 'clickaway') {
      return;
    }

    setNotificationState({ notifState: false })
  };

  render() {
    const { notificationType, notificationMessage, openNotification } = this.props;

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={openNotification}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <NotificationContent
            onClose={this.handleClose}
            variant={notificationType}
            message={notificationMessage}
          />
        </Snackbar>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(NotificationContainer));