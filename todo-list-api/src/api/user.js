import { Router } from 'express';

export default ({ config, db }) => {
  const api = Router();

  api.get('/auth', (req, res) => {
    res.send('User').status(200);
  });

  return api;
};