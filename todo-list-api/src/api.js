import { Router } from 'express';
import user from './api/user';
import tasks from './api/tasks';
import projects from './api/projects';

export default ({ config, db, mysql }) => {
  const api = Router();

  api.use('/user', user({ config, db, mysql }));

  api.use('/tasks', tasks({ config, db, mysql }));

  api.use('/projects', projects({ config, db, mysql }));

  return api;
};