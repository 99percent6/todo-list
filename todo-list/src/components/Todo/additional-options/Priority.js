import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../core/actions';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { priorityList } from '../../../helpers';

const mapStateToProps = (state) => {
  const { addTask } = state;
  const props = {
    priority: addTask.priority,
  };
  return props;
};

const actionCreators = {
  updPriorityTask: actions.updPriorityTask,
};

const styles = theme => ({
  formControl: {
    minWidth: 200,
  },
  itemMenu: {
    padding: '0px 0px 0px 15px',
  },
  selectValue: {
    display: 'flex',
    alignItems: 'center',
  },
});

class Priority extends Component {
  state = {
    priority: {
      commonStyle: {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
      },
      list: priorityList(),
    }
  };

  handleChange = event => {
    const { updPriorityTask } = this.props;
    updPriorityTask({ priority: event.target.value });
  };

  renderMenuItem = () => {
    const { priority } = this.state;
    const { classes } = this.props;
    let style = priority.commonStyle;
    return priority.list.map(item => {
      style = { ...style, backgroundColor: item.color };
      return (
        <MenuItem key={item.color} value={item.code}>
          <div style={style}/>
          <ListItemText className={classes.itemMenu} inset primary={item.value} />
        </MenuItem>
      )
    })
  };

  renderSelectedPriorityValue = (value) => {
    const { priority } = this.state;
    const { classes } = this.props;
    const selectedValue = priority.list.find(item => parseInt(item.code) === parseInt(value));
    let style = { ...priority.commonStyle, backgroundColor: selectedValue.color, marginRight: '15px' };
    if (selectedValue) {
      return (
        <div className={classes.selectValue}>
          <div style={style}/>
          <div>{ selectedValue.value }</div>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    const { classes, priority } = this.props;

    return (
      <div className="additional-options">
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="priority">Приоритет</InputLabel>
          <Select
            value={priority}
            onChange={this.handleChange}
            name="priority"
            renderValue={this.renderSelectedPriorityValue}
            input={<Input id="priority" />}
          >
            { this.renderMenuItem() }
          </Select>
        </FormControl>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Priority));