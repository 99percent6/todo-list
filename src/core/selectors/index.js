import { createSelector } from 'reselect';

const getTasks = state => state.tasks;

export const tasksSelector = createSelector(
  getTasks,
  tasks => Object.values(tasks),
);
export const activeTasksSelector = createSelector(
  tasksSelector,
  tasks => tasks.filter(t => t.state === 'active'),
);
export const finishedTasksSelector = createSelector(
  tasksSelector,
  tasks => tasks.filter(t => t.state === 'finished'),
);