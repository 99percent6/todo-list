import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { omit } from 'lodash';

const text = handleActions({
  [actions.updText](state, { payload: { text } }) {
    return text;
  },
  [actions.addTask]() {
    return '';
  },
}, '');

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
    return { activeTaskTable };
  },
}, { activeTaskTable: 'active' });

const user = handleActions({
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
}, { login: '', password: '', token: '', current: null });

export default combineReducers({
  text,
  tasks,
  UIState,
  user,
});