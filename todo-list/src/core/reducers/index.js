import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import { db } from '../db';
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
    db.collection(window.dbCollectionName).doc(id).delete().catch(err => {
      console.error("Error removing document: ", err);
    });
    return omit(state, [id]);
  },
  [actions.updTask](state, { payload: { task } }) {
    db.collection(window.dbCollectionName).doc(task.id).update(task);
    return {...state, [task.id]: task};
  },
  [actions.updTaskState](state, { payload: { task } }) {
    const status = task.state === 'active' ? 'finished' : 'active';
    task = { ...task, state: status };
    db.collection(window.dbCollectionName).doc(task.id).update({
      state: status,
    });
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

export default combineReducers({
  text,
  tasks,
  UIState,
});