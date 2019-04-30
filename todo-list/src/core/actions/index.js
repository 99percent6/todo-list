import { createAction } from 'redux-actions';
import { db } from '../../core/db';
import config from '../../config/config.json';
import { queryHandler } from '../lib/task';

export const updUserLogin = createAction('UPD_USER_LOGIN');
export const updUserPassword = createAction('UPD_USER_PASSWORD');
export const updUserToken = createAction('UPD_USER_TOKEN');
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
export const authUser = ({ login, password }) => async (dispatch) => {
  try {
    const url = `${config.api.host}/user/login`;
    queryHandler({ url, method: 'POST', body: { login, password } }).then(result => {
      if (result && result.code === 200) {
        dispatch(updUserToken({ token: result.result }));
        return result;
      }
    }).catch(err => {
      console.error(err);
    });
  } catch (error) {
    console.error('Error during auth user - ', error);
  }
}