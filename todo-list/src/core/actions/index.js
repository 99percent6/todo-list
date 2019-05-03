import { createAction } from 'redux-actions';
import config from '../../config/config.json';
import { queryHandler } from '../lib/task';

export const updUserLogin = createAction('UPD_USER_LOGIN');
export const updUserPassword = createAction('UPD_USER_PASSWORD');
export const updUserToken = createAction('UPD_USER_TOKEN');
export const updUserCurrent = createAction('UPD_USER_CURRENT');
export const updActiveTaskTab = createAction('UPD_ACTIVE_TASK_TAB');
export const updText = createAction('UPD_TEXT');
export const addTask = createAction('ADD_TASK');
export const delTask = createAction('DEL_TASK');
export const updTask = createAction('UPD_TASK');
export const replaceTasks = createAction('REPLACE_TASKS');

export const syncTasks = ({ token }) => async (dispatch) => {
  if (!token) {
    throw new Error('Token is required field');
  }
  try {
    const url = `${config.api.host}/tasks/list`;
    const result = await queryHandler({ url, method: 'GET' });
    if (result && result.code === 200) {
      let objList = {};
      result.result.forEach(task => {
        objList = { ...objList, [task.id]: task };
      })
      dispatch(replaceTasks({ tasks: objList }));
    }
  } catch (error) {
    console.error(error);
  }
}

export const asyncAddTask = ({ task }) => async (dispatch) => {
  if (!task) {
    throw new Error('Task is required field');
  }
  try {
    dispatch(addTask({ task }));
    const url = `${config.api.host}/tasks/addTask`;
    const result = await queryHandler({ url, method: 'PUT', body: task });
    return result;
  } catch (error) {
    console.error('Error at adding a task: ', error);
  }
};

export const asyncDeleteTask = ({ id }) => async (dispatch) => {
  if (!id) {
    throw new Error('Id is required field');
  }
  try {
    dispatch(delTask({ id }));
    const url = `${config.api.host}/tasks/deleteTask`;
    const result = await queryHandler({ url, method: 'POST', body: { id } });
    return result;
  } catch (error) {
    console.error('Error at deleting task: ', error);
  }
};

export const asyncUpdateTask = ({ task }) => async (dispatch) => {
  if (!task) {
    throw new Error('Task is required field');
  }
  try {
    dispatch(updTask({ task }));
    const url = `${config.api.host}/tasks/updateTask`;
    const result = await queryHandler({ url, method: 'PUT', body: task });
    return result;
  } catch (error) {
    console.error('Error at updating task: ', error);
  }
};

export const authUser = ({ login, password }) => async (dispatch) => {
  if (!login || !password) {
    throw new Error('Missing required fields');
  }
  try {
    const url = `${config.api.host}/user/login`;
    const result = await queryHandler({ url, method: 'POST', body: { login, password } });
    if (result && result.code === 200) {
      dispatch(updUserToken({ token: result.result }));
      return result.result;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error during auth user - ', error);
  }
};

export const getUser = ({ token }) => async (dispatch) => {
  if (!token) {
    throw new Error('Token is required field');
  }
  try {
    const url = `${config.api.host}/user/getUser`;
    const result = await queryHandler({ url, method: 'GET' });
    if (result && result.code === 200) {
      dispatch(updUserCurrent({ user: result.result }));
      return result.result;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};