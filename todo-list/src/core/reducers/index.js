import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { omit } from 'lodash';

const addTask = handleActions({
  [actions.updText](state, { payload: { text } }) {
    return {
      ...state,
      value: text,
    };
  },
  [actions.updEditValue](state, { payload: { text } }) {
    return {
      ...state,
      editValue: text,
    };
  },
  [actions.addTask](state) {
    return {
      ...state,
      value: '',
      priority: '',
      executionDate: null,
    };
  },
  [actions.updPriorityTask](state, { payload: { priority } }) {
    return {
      ...state,
      priority,
    };
  },
  [actions.updPeriodOfExecution](state, { payload: { executionDate } }) {
    return {
      ...state,
      executionDate,
    };
  },
}, { value: '', editValue: '', priority: '', executionDate: null });

const tasks = handleActions({
  [actions.addTask](state, { payload: { task } }) {
    return {[task.id]: task, ...state};
  },
  [actions.delTask](state, { payload: { id } }) {
    return omit(state, [id]);
  },
  [actions.updTask](state, { payload: { task } }) {
    return {...state, [task.id]: task};
  },
  [actions.replaceTasks](state, { payload: { tasks } }) {
    return tasks;
  },
}, {});

const UIState = handleActions({
  [actions.updActiveTaskTab](state, { payload: { value } }) {
    let { activeTaskTable } = state;
    activeTaskTable = value;
    return {
      ...state,
      activeTaskTable
    };
  },
  [actions.setAuthUserState](state, { payload: { authState } }) {
    return {
      ...state,
      authUserState: authState,
    };
  },
  [actions.setRegistrationUserState](state, { payload: { registrationState } }) {
    return {
      ...state,
      registrationUserState: registrationState,
    };
  },
  [actions.changeVisibleSidebar](state, { payload: { isVisibleSidebar } }) {
    return {
      ...state,
      isVisibleSidebar,
    } ;
  },
}, { activeTaskTable: 'active', authUserState: 'none', registrationUserState: 'none', isVisibleSidebar: false });

const user = handleActions({
  [actions.updUserToken](state, { payload: { token } }) {
    return {
      ...state,
      token,
    }
  },
  [actions.updUserCurrent](state, { payload: { user } }) {
    return {
      ...state,
      current: user,
    }
  },
}, { token: '', current: null });

const userAuth = handleActions({
  [actions.updUserLogin](state, { payload: { login } }) {
    return {
      ...state,
      login,
    };
  },
  [actions.updUserPassword](state, { payload: { password } }) {
    return {
      ...state,
      password,
    };
  },
}, { login: '', password: '' });

const userRegistration = handleActions({
  [actions.updRegistrationUserLogin](state, { payload: { login } }) {
    return {
      ...state,
      login,
    };
  },
  [actions.updRegistrationUserPassword](state, { payload: { password } }) {
    return {
      ...state,
      password,
    };
  },
  [actions.updRegistrationUserRepeatedPassword](state, { payload: { repeatedPassword } }) {
    return {
      ...state,
      repeatedPassword,
    };
  },
  [actions.updRegistrationUserName](state, { payload: { name } }) {
    return {
      ...state,
      name,
    };
  },
  [actions.updRegistrationUserEmail](state, { payload: { email } }) {
    return {
      ...state,
      email,
    };
  },
}, { login: '', password: '', repeatedPassword: '', name: '', email: '' });

const notifications = handleActions({
  [actions.setNotificationState](state, { payload: { notifState } }) {
    return {
      ...state,
      open: notifState,
    };
  },
  [actions.setNotification](state, { payload: { open, message, type } }) {
    return {
      ...state,
      open,
      message,
      type,
    }
  },
}, { open: false, message: '', type: '' });

const feedback = handleActions({
  [actions.updFeedbackTitle](state, { payload: { title } }) {
    return {
      ...state,
      title,
    };
  },
  [actions.updFeedbackContent](state, { payload: { content } }) {
    return {
      ...state,
      content,
    };
  },
  [actions.updFeedbackEmail](state, { payload: { email } }) {
    return {
      ...state,
      email,
    };
  },
  [actions.updFeedbackAllFields](state, { payload: { title, content, email } }) {
    return {
      ...state,
      title,
      content,
      email,
    }
  },
}, { title: '', content: '', email: '' });

export default combineReducers({
  addTask,
  tasks,
  UIState,
  user,
  userAuth,
  userRegistration,
  notifications,
  feedback,
});