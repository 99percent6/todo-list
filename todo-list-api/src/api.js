import { Router } from 'express';
import user from './api/user';
import tasks from './api/tasks';
import projects from './api/projects';

export default ({ config, db, mysql, redisClient }) => {
  const api = Router();

  api.use('/user', user({ config, db, mysql, redisClient }));

  api.use('/tasks', tasks({ config, db, mysql, redisClient }));

  api.use('/projects', projects({ config, db, mysql, redisClient }));

  return api;
};