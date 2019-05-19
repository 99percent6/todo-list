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
      project: '',
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
  [actions.updProjectTask](state, { payload: { project } }) {
    return {
      ...state,
      project,
    };
  },
}, { value: '', editValue: '', priority: '', executionDate: null, project: '' });

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
  [actions.setSyncTasksState](state, { payload: { syncTasksState } }) {
    return {
      ...state,
      syncTasksState,
    };
  },
  [actions.changeVisibleSidebar](state, { payload: { isVisibleSidebar } }) {
    return {
      ...state,
      isVisibleSidebar,
    } ;
  },
}, { activeTaskTable: 'active', authUserState: 'none', registrationUserState: 'none', syncTasksState: 'none', isVisibleSidebar: false });

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

const project = handleActions({
  [actions.updProjectList](state, { payload: { list } }) {
    return {
      ...state,
      list,
    };
  },
  [actions.addProject](state, { payload: { project } }) {
    let projectList = state.list;
    projectList = { ...projectList, [project.id]: project };
    return {
      ...state,
      name: '',
      list: projectList,
    };
  },
  [actions.deleteProject](state, { payload: { id } }) {
    return {
      ...state,
      list: omit(state.list, [id]),
    };
  },
  [actions.updProjectName](state, { payload: { name } }) {
    return {
      ...state,
      name,
    };
  },
}, { list: {}, name: '' });

export default combineReducers({
  addTask,
  tasks,
  UIState,
  user,
  userAuth,
  userRegistration,
  notifications,
  feedback,
  project,
});