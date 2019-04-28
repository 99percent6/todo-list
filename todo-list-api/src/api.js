import { Router } from 'express';
import user from './api/user';

export default ({ config, db }) => {
  const api = Router();

  api.use('/user', user({ config, db }));

  return api;
};