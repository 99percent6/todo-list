import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../core/actions';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import validator from 'validator';
import ValidationMessage from '../components/pages/ValidationMessage';

const mapStateToProps = (state) => {
  const { title, content, email } = state.feedback;
  const props = {
    title,
    content,
    email,
  };
  return props;
};

const actionCreators = {
  updFeedbackTitle: actions.updFeedbackTitle,
  updFeedbackContent: actions.updFeedbackContent,
  updFeedbackEmail: actions.updFeedbackEmail,
  sendFeedback: actions.sendFeedback,
  setNotification: actions.setNotification,
};

const styles = theme => ({
  root: {
    margin: '50px auto',
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textField: {
    width: '80%',
  },
  dense: {
    marginTop: 19,
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  },
  sendButton: {
    marginRight: '20px',
  },
});

class Feedback extends Component {
  state = {
    isValidEmail: false,
    validationMessage: '',
  };

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleChange = (event, type) => {
    const { value } = event.target;
    const { updFeedbackTitle, updFeedbackContent, updFeedbackEmail } = this.props;
    const allowTypes = ['title', 'content', 'email'];
    if (type === 'email') {
      const isValidEmail = validator.isEmail(value) && !validator.isEmpty(value);
      this.setState({ isValidEmail, validationMessage: isValidEmail ? '' : 'Пожалуйста, введите корректный email' });
    }
    const actionMap = {
      title: (title) => updFeedbackTitle({ title }),
      content: (content) => updFeedbackContent({ content }),
      email: (email) => updFeedbackEmail({ email }),
    };
    if (type && allowTypes.includes(type)) {
      actionMap[type](value);
    }
  };

  sendFeedback = () => {
    const { title, content, email, sendFeedback, setNotification, history } = this.props;
    const data = {
      title,
      content,
      email,
    };
    sendFeedback({ data });
    setNotification({ open: true, message: 'Благодарим за уделенное внимание, письмо успешно отправлено.', type: 'success' });
    history.push('/');
  };

  render() {
    const { classes, title, content, email } = this.props;
    const { validationMessage, isValidEmail } = this.state;
    const isValidForm = isValidEmail && title && content;

    return (
      <div className={classes.root}>
        <TextField
          id="standard-dense"
          label="Тема"
          value={title}
          onChange={(e) => this.handleChange(e, 'title')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
        />
        <TextField
          id="standard-multiline-static"
          label="О чем вы хотите написать?"
          multiline
          rows="4"
          value={content}
          onChange={(e) => this.handleChange(e, 'content')}
          className={classes.textField}
          margin="normal"
        />
        <TextField
          id="standard-dense"
          label="Ваш email для ответа"
          value={email}
          onChange={(e) => this.handleChange(e, 'email')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
        />
        <ValidationMessage message={validationMessage} isVisible={!isValidEmail}/>
        <div className={classes.btnContainer}>
          <Button variant="outlined" color="primary" onClick={this.sendFeedback} disabled={!isValidForm} className={classes.sendButton}>
            Отправить
          </Button>
          <Button variant="outlined" color="secondary" onClick={this.goBack}>
            Назад
          </Button>
        </div>
      </div>
    );
  };
}

export default connect(mapStateToProps, actionCreators)(withStyles(styles)(Feedback));