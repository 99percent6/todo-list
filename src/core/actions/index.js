import { createAction } from 'redux-actions';
import { db } from '../../core/db';

export const updActiveTaskTab = createAction('UPD_ACTIVE_TASK_TAB');
export const updText = createAction('UPD_TEXT');
export const addTask = createAction('ADD_TASK');
export const delTask = createAction('DEL_TASK');
export const updTask = createAction('UPD_TASK');
export const updTaskState = createAction('UPD_TASK_STATE');
export const replaceTasks = createAction('REPLACE_TASKS');
export const asyncAddTask = (task) => async (dispatch) => {
  try {
    dispatch(addTask({ task }));
    const result = await db.collection(window.dbCollectionName).add(task);
    return result;
  } catch (error) {
    console.error('Error at adding a task ', error);
  }
};