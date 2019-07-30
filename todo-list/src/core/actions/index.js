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
export const updProjectTask = createAction('UPD_PROJECT_TASK');
export const updEditProjectTask = createAction('UPD_EDIT_PROJECT_TASK');
export const updTaskDescription = createAction('UPD_TASK_DESCRIPTION');
export const addTask = createAction('ADD_TASK');
export const delTask = createAction('DEL_TASK');
export const updTask = createAction('UPD_TASK');
export const replaceTasks = createAction('REPLACE_TASKS');
export const setTaskSort = createAction('SET_TASK_SORT');
export const setAuthUserState = createAction('SET_AUTH_USER_STATE');
export const setRegistrationUserState = createAction('SET_REGISTRATION_USER_STATE');
export const setSyncTasksState = createAction('SET_SYNC_TASKS_STATE');
export const setNotificationState = createAction('SET_NOTIFICATION_STATE');
export const setNotification = createAction('SET_NOTIFICATION');
export const changeVisibleSidebar = createAction('CHANGE_VISIBLE_SIDEBAR');
export const updFeedbackTitle = createAction('UPD_FEEDBACK_TITLE');
export const updFeedbackContent = createAction('UPD_FEEDBACK_CONTENT');
export const updFeedbackEmail = createAction('UPD_FEEDBACK_EMAIL');
export const updFeedbackAllFields = createAction('UPD_FEEDBACK_ALL_FIELDS');
export const updProjectList = createAction('UPD_PROJECT_LIST');
export const updProjectName = createAction('UPD_PROJECT_NAME');
export const addProject = createAction('ADD_PROJECT');
export const deleteProject = createAction('DELETE_PROJECT');
export const setSyncProjectsState = createAction('SET_SYNC_PROJECTS_STATE');

export const syncTasks = ({ token, field = '', value = '', sort }) => async(dispatch) => {
    if (!token) {
        dispatch(setSyncTasksState({ syncTasksState: 'fail' }));
        throw new Error('Token is required field');
    }
    try {
        let url = `${apiHost}/tasks/list?sort=${sort}`;
        if (field && value) {
            url += `&field=${field}&value=${value}`;
        }
        dispatch(setSyncTasksState({ syncTasksState: 'request' }));
        const result = await queryHandler({ url, method: 'GET' });
        if (result && result.code === 200) {
            let objList = {};
            result.result.forEach(task => {
                objList = { ...objList, [`'${task.id}'`]: task };
            })

            dispatch(setSyncTasksState({ syncTasksState: 'success' }));
            dispatch(replaceTasks({ tasks: objList }));
        } else {
            dispatch(setSyncTasksState({ syncTasksState: 'fail' }));
            dispatch(setNotification({ open: true, message: 'Ошибка при загрузке списка задач, попробуйте перелогиниться.', type: 'error' }));
        }
    } catch (error) {
        dispatch(setSyncTasksState({ syncTasksState: 'fail' }));
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
        const result = await queryHandler({ url, method: 'DELETE', body: { id } });
        return result;
    } catch (error) {
        console.error('Error at deleting task: ', error);
    }
};

export const asyncDeleteTasksByProject = ({ projectId }) => async(dispatch) => {
    if (!projectId) {
        throw new Error('Project id is required field');
    }
    try {
        const url = `${apiHost}/tasks/deleteByProjectId?projectId=${projectId}`;
        const result = await queryHandler({ url, method: 'DELETE' });
        return result;
    } catch (error) {
        console.error('Error at deleting tasks: ', error);
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

export const getProjects = ({ token }) => async(dispatch) => {
    if (!token) {
        dispatch(setSyncProjectsState({ syncProjectsState: 'error' }));
        throw new Error('Token is required field');
    }
    try {
        const url = `${apiHost}/projects/list`;
        dispatch(setSyncProjectsState({ syncProjectsState: 'request' }));
        const result = await queryHandler({ url, method: 'GET' });
        if (result && result.code === 200) {
            let objList = {};
            result.result.forEach(project => {
                objList = { ...objList, [project.id]: project };
            })
            dispatch(setSyncProjectsState({ syncProjectsState: 'success' }));
            dispatch(updProjectList({ list: objList }));
        } else {
            dispatch(setSyncProjectsState({ syncProjectsState: 'error' }));
            dispatch(setNotification({ open: true, message: 'Ошибка при загрузке списка проектов.', type: 'error' }));
        }
        return result;
    } catch (error) {
        dispatch(setSyncProjectsState({ syncProjectsState: 'error' }));
        console.error(error);
    }
};

export const createProject = ({ project }) => async(dispatch) => {
    if (!project) {
        throw new Error('Missing required fields');
    }
    try {
        dispatch(addProject({ project }));
        const url = `${apiHost}/projects/create`;
        const result = await queryHandler({ url, method: 'POST', body: { ...project } });
        return result;
    } catch (error) {
        console.error(error);
    }
};

export const asyncDeleteProject = ({ id }) => async(dispatch) => {
    if (!id) {
        throw new Error('Missing required fields');
    }
    try {
        dispatch(deleteProject({ id }));
        const url = `${apiHost}/projects/delete?id=${id}`;
        const result = await queryHandler({ url, method: 'DELETE' });
        return result;
    } catch (error) {
        console.error(error);
    }
};