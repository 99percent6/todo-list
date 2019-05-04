import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    color: 'red',
    fontSize: '12px',
  },
});

class ValidationMessage extends Component {
  render() {
    const { message, classes, isVisible } = this.props;
    const content = () => {
      if (isVisible) {
        return (
          <span className={classes.root}>{ message }</span>
        );
      } else {
        return null
      }
    }

    return content();
  }
}

export default withStyles(styles)(ValidationMessage);