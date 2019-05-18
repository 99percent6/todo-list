import { Router } from 'express';
import Database from '../lib/db';
import Redis from '../lib/redis';

const redisClient = new Redis({ expire: 3600 });

export default ({ config, db }) => {
  const api = Router();
  const database = new Database({ config, db });

  api.get('/list', async function (req, res) {
    const { token } = req.query;
    if (!token) {
      return res.send({ result: 'Token is required field', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const userId = user.id;
        const result = await database.getProjects({ userId });
        return res.send(result).status(result.code);
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.post('/create', async function (req, res) {
    const { token } = req.query;
    let project = req.body;
    if (!token || !project) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        project = { ...project, author: user.id };
        const result = await database.createProject({ project });
        return res.send(result).status(result.code);
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.delete('/delete', async function (req, res) {
    const { token, id } = req.query;
    if (!token || !id) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const result = await database.deleteProject({ id });
        return res.send(result).status(result.code);
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  return api;
};