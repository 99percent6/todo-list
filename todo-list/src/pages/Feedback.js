import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: '50px auto',
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1000,
    display: 'flex',
    justifyContent: 'center',
  },
});

class Feedback extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        В разработке...
      </div>
    );
  }
}

export default withStyles(styles)(Feedback);