import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../core/actions';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Priority from './additional-options/Priority';
import PeriodOfExecution from './additional-options/PeriodOfExecution';
import Project from './additional-options/Project';
import TaskDescription from './additional-options/Description';
import '../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    project: addTask.project,
  };
  return props;
};

const actionCreators = {
  updProjectTask: actions.updProjectTask,
};

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: '20px',
    padding: '0 10px',
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class AddTaskAdditionalOpts extends Component {
  render() {
    const { classes, project, updProjectTask } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading} variant="caption">Дополнительно</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="options-container between-xs">
            <Priority/>
            <PeriodOfExecution/>
            <Project project={project} updProjectTask={updProjectTask}/>
            <TaskDescription/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(AddTaskAdditionalOpts));