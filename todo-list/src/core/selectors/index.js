import { createSelector } from 'reselect';

const getTasks = state => state.tasks.list;
const getProjects = state => state.project.list;

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

export const projectsSelector = createSelector(
  getProjects,
  projects => {
    let projectList = Object.values(projects);
    projectList.unshift({
      id: 'all',
      name: 'Все',
      slug: 'all',
    });
    return projectList;
  },
);