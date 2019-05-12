import { createAction } from 'redux-actions';
import config from '../../config/config.json';
import { queryHandler } from '../lib/task';
import { deleteCookie } from '../lib/cookies';

const apiHost = config.api.host;

export const updUserLogin = createAction('UPD_USER_LOGIN');
export const updUserPassword = createAction('UPD_USER_PASSWORD');
export const updUserToken = createAction('UPD_USER_TOKEN');
export const updUserCurrent = createAction('UPD_USER_CURRENT');
export const updRegistrationUserLogin = createAction('UPD_REGISTRATION_USER_LOGIN');
export const updRegistrationUserPassword = createAction('UPD_REGISTRATION_USER_PASSWORD');
export const updRegistrationUserRepeatedPassword = createAction('UPD_REGISTRATION_USER_REPEATED_PASSWORD');
export const updRegistrationUserName = createAction('UPD_REGISTRATION_USER_NAME');
export const updRegistrationUserEmail = createAction('UPD_REGISTRATION_USER_EMAIL');
export const updActiveTaskTab = createAction('UPD_ACTIVE_TASK_TAB');
export const updText = createAction('UPD_TEXT');
export const updEditValue = createAction('UPD_NEW_VALUE');
export const updPriorityTask = createAction('UPD_PRIORITY_TASK');
export const updPeriodOfExecution = createAction('UPD_PERIOD_OF_EXECUTION');
export const addTask = createAction('ADD_TASK');
export const delTask = createAction('DEL_TASK');
export const updTask = createAction('UPD_TASK');
export const replaceTasks = createAction('REPLACE_TASKS');
export const setAuthUserState = createAction('SET_AUTH_USER_STATE');
export const setRegistrationUserState = createAction('SET_REGISTRATION_USER_STATE');
export const setNotificationState = createAction('SET_NOTIFICATION_STATE');
export const setNotification = createAction('SET_NOTIFICATION');
export const changeVisibleSidebar = createAction('CHANGE_VISIBLE_SIDEBAR');
export const updFeedbackTitle = createAction('UPD_FEEDBACK_TITLE');
export const updFeedbackContent = createAction('UPD_FEEDBACK_CONTENT');
export const updFeedbackEmail = createAction('UPD_FEEDBACK_EMAIL');
export const updFeedbackAllFields = createAction('UPD_FEEDBACK_ALL_FIELDS');

export const syncTasks = ({ token }) => async(dispatch) => {
    if (!token) {
        throw new Error('Token is required field');
    }
    try {
        const url = `${apiHost}/tasks/list`;
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

export const asyncAddTask = ({ task }) => async(dispatch) => {
    if (!task) {
        throw new Error('Task is required field');
    }
    try {
        dispatch(addTask({ task }));
        const url = `${apiHost}/tasks/addTask`;
        const result = await queryHandler({ url, method: 'PUT', body: task });
        return result;
    } catch (error) {
        console.error('Error at adding a task: ', error);
    }
};

export const asyncDeleteTask = ({ id }) => async(dispatch) => {
    if (!id) {
        throw new Error('Id is required field');
    }
    try {
        dispatch(delTask({ id }));
        const url = `${apiHost}/tasks/deleteTask`;
        const result = await queryHandler({ url, method: 'POST', body: { id } });
        return result;
    } catch (error) {
        console.error('Error at deleting task: ', error);
    }
};

export const asyncUpdateTask = ({ task }) => async(dispatch) => {
    if (!task) {
        throw new Error('Task is required field');
    }
    try {
        dispatch(updTask({ task }));
        const url = `${apiHost}/tasks/updateTask`;
        const result = await queryHandler({ url, method: 'PUT', body: task });
        return result;
    } catch (error) {
        console.error('Error at updating task: ', error);
    }
};

export const registrationUser = ({ user }) => async(dispatch) => {
    if (!user) {
        throw new Error('User is required field');
    }
    try {
        const url = `${apiHost}/user/registration`;
        dispatch(setRegistrationUserState({ registrationState: 'request' }));
        const result = await queryHandler({ url, method: 'POST', body: user });
        if (result && result.code === 200) {
            dispatch(setRegistrationUserState({ registrationState: 'success' }));
            return result;
        } else {
            dispatch(setRegistrationUserState({ registrationState: 'fail' }));
            return result;
        }
    } catch (error) {
        dispatch(setRegistrationUserState({ registrationState: 'fail' }));
        console.error('Error at registration user: ', error);
    }
};

export const authUser = ({ login, password }) => async(dispatch) => {
    if (!login || !password) {
        throw new Error('Missing required fields');
    }
    try {
        const url = `${apiHost}/user/login`;
        dispatch(setAuthUserState({ authState: 'request' }));
        const result = await queryHandler({ url, method: 'POST', body: { login, password } });
        if (result && result.code === 200) {
            dispatch(setAuthUserState({ authState: 'success' }));
            dispatch(updUserToken({ token: result.result }));
            return result.result;
        } else {
            dispatch(setAuthUserState({ authState: 'fail' }));
            return null;
        }
    } catch (error) {
        dispatch(setAuthUserState({ authState: 'fail' }));
        console.error('Error during auth user - ', error);
    }
};

export const logout = ({ token }) => async(dispatch) => {
    if (!token) {
        throw new Error('Token is required field');
    }
    try {
        const url = `${apiHost}/user/logout`;
        const result = await queryHandler({ url, method: 'POST' });
        if (result && result.code === 200) {
            deleteCookie('token');
            deleteCookie('user');
            dispatch(updUserToken({ token: '' }));
            dispatch(updUserCurrent({ user: null }));
            dispatch(replaceTasks({ tasks: {} }));
        }
        return result;
    } catch (error) {
        console.error(error);
    }
};

export const getUser = ({ token }) => async(dispatch) => {
    if (!token) {
        throw new Error('Token is required field');
    }
    try {
        const url = `${apiHost}/user/getUser?token=${token}`;
        dispatch(setAuthUserState({ authState: 'request' }));
        const result = await queryHandler({ url, method: 'GET' });
        if (result && result.code === 200) {
            dispatch(setAuthUserState({ authState: 'success' }));
            dispatch(updUserCurrent({ user: result.result }));
            return result.result;
        } else {
            dispatch(setAuthUserState({ authState: 'fail' }));
            return null;
        }
    } catch (error) {
        dispatch(setAuthUserState({ authState: 'fail' }));
        console.error(error);
    }
};

export const sendFeedback = ({ data }) => async(dispatch) => {
    if (!data) {
        throw new Error('Missing required fields');
    }
    try {
        const url = `${apiHost}/user/sendFeedback`;
        const result = await queryHandler({ url, method: 'POST', body: data });
        dispatch(updFeedbackAllFields({ title: '', content: '', email: '' }));
        return result;
    } catch (error) {
        console.error(error);
    }
};