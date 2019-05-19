import { Router } from 'express';
import Database from '../lib/db';
import Redis from '../lib/redis';

const redisClient = new Redis({ expire: 3600 });

export default ({ config, db }) => {
  const api = Router();
  const database = new Database({ config, db });

  api.get('/list', async function (req, res) {
    const { token, field, value } = req.query;
    if (!token) {
      return res.send({ result: 'Token is required field', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const userId = user.id;
        let result;
        if (field && value) {
          result = await database.getTasks({ value, field });
        } else {
          result = await database.getTasks({ value: userId });
        }
        if (result && result.code === 200) {
          return res.send(result).status(result.code);
        } else {
          return res.send(result).status(404);
        }
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.put('/addTask', async function (req, res) {
    const token = req.query.token;
    let task = req.body;
    if (!task || !token) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        task = { ...task, author: user.id, createdAt: Date.now() };
        const result = await database.addTask({ task });
        return res.send(result).status(result.code);
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.post('/deleteTask', async function (req, res) {
    const token = req.query.token;
    const { id } = req.body;
    if (!token || !id) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const result = await database.deleteTask({ id });
        return res.send(result).status(result.code);
      } else {
        return res.send({ result: 'User is not authorized', code: 401 }).status(401);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.put('/updateTask', async function (req, res) {
    const token = req.query.token;
    const task = req.body;
    if (!token || !task) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const result = await database.updateTask({ task });
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
}