import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../core/actions';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import Grid from '@material-ui/core/Grid';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
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

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersModal: {
      dialogRoot: {
        margin: '10px',
        minWidth: '320px',
      },
    },
    MuiDialog: {
      paperScrollPaper: {
        maxHeight: '100%',
      },
    }
  },
});

class PeriodOfExecution extends Component {
  handleDateChange = date => {
    const { updPeriodOfExecution } = this.props;
    updPeriodOfExecution({ executionDate: date ? moment(date).format() : null });
  };

  render() {
    const { executionDate } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
        <Grid container className="period-of-execution" justify="flex-start">
          <ThemeProvider theme={materialTheme}>
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
              format="dd MMMM yyyy HH:mm"
            />
          </ThemeProvider>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(PeriodOfExecution));