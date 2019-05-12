import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../core/actions';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import '../../../css/components/todoList/base.scss';

const mapStateToProps = (state) => {
  const { executionDate } = state.addTask;
  const props = {
    executionDate,
  };
  return props;
};

const actionCreators = {
  updPeriodOfExecution: actions.updPeriodOfExecution,
};

const styles = {};

class PeriodOfExecution extends Component {
  handleDateChange = date => {
    const { updPeriodOfExecution } = this.props;
    updPeriodOfExecution({ executionDate: moment(date).format() });
  };

  render() {
    const { executionDate } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <Grid container className="period-of-execution" justify="flex-start">
          <DateTimePicker
            clearable
            label="Срок исполнения"
            inputVariant="standard"
            invalidDateMessage="Неверный формат даты"
            cancelLabel="Закрыть"
            clearLabel="Очистить"
            ampm={false}
            value={executionDate}
            onChange={this.handleDateChange}
            format="dd MMMM yyyy hh:mm"
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(PeriodOfExecution));