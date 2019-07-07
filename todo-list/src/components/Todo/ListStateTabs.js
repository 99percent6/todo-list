import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as actions from '../../core/actions';

const mapStateToProps = (state) => {
  const { UIState } = state;
  const props = {
    UIState,
  };
  return props;
};

const actionCreators = {
  updActiveTaskTab: actions.updActiveTaskTab,
};

class ListStateTabs extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    const { updActiveTaskTab } = this.props;
    const mapping = {
      0: 'active',
      1: 'matrix',
      2: 'finished'
    }
    this.setState({ value });
    updActiveTaskTab({ value: mapping[value] });
  };

  render() {
    return (
      <Paper square>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          variant="fullWidth"
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="Активные" />
          <Tab label="Матрица приоритетов" />
          <Tab label="Выполненные" />
        </Tabs>
      </Paper>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(ListStateTabs);