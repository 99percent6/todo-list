import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Priority from './additional-options/Priority';
import PeriodOfExecution from './additional-options/PeriodOfExecution';
import '../../css/components/todoList/base.scss';

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: '20px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  primary: {
    marginLeft: '15px',
  }
});

class AddTaskAdditionalOpts extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading} variant="caption">Дополнительно</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="options-container">
            <Priority/>
            <PeriodOfExecution/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  };
}

export default withStyles(styles)(AddTaskAdditionalOpts);