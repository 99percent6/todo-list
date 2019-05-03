import { Router } from 'express';
import user from './api/user';
import tasks from './api/tasks';

export default ({ config, db }) => {
  const api = Router();

  api.use('/user', user({ config, db }));

  api.use('/tasks', tasks({ config, db }));

  return api;
};