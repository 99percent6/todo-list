import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    margin: {
      margin: '8px 8px 8px 0',
    },
    extendedIcon: {
      marginLeft: theme.spacing(1),
    },
  });

class AddProject extends Component {
  render() {
    const { classes, openDialog } = this.props; 

    return (
      <div>
        <Fab
          variant="extended"
          size="medium"
          color="secondary"
          aria-label="Add"
          className={classes.margin}
          onClick={openDialog}
        >
          Добавить проект
          <AddIcon className={classes.extendedIcon}/>
        </Fab>
      </div>
    );
  };
}

export default withStyles(styles)(AddProject);