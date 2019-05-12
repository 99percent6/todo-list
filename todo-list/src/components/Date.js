import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';

class Date extends Component {
  static defaultProps = {
    tz: null,
    format: 'DD MMMM YYYY HH:mm',
  };

  render() {
    const { date, tz, format } = this.props;

    return date ? <Moment element="span" date={date} format={format} tz={tz} locale="ru"/> : null;
  };
}

export default Date;