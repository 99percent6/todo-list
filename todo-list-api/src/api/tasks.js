import { Router } from 'express';
import Database from '../lib/db';

export default ({ config, db, mysql, redisClient }) => {
  const api = Router();
  const database = new Database({ config, db, mysql });

  api.get('/list', async function (req, res) {
    const { token, field, value, sort } = req.query;

    if (!token) {
      return res.send({ result: 'Token is required field', code: 500 }).status(500);
    }
    
    try {
      const user = await redisClient.get(token);
      if (user) {
        const userId = user.id;
        let result;
        const sortField = sort.split(':')[0];
        const sortValue = sort.split(':')[1];

        if (field && value) {
          result = await database.getTasks({ value, field, sortField, sortValue });
        } else {
          result = await database.getTasks({ value: userId, sortField, sortValue });
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
        task = {
          ...task,
          author: user.id,
          createdAt: Date.now()
        };

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

  api.delete('/deleteTask', async function (req, res) {
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

  api.delete('/deleteByProjectId', async function (req, res) {
    const { token, projectId } = req.query;
    if (!token || !projectId) {
      return res.send({ result: 'Missing required fields', code: 500 }).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const tasksList = await database.getTasks({ value: projectId, field: 'project.id' });
        if (tasksList.code === 200 && tasksList.result.length) {
          for (let task of tasksList.result) {
            const result = await database.deleteTask({ id: task.id });
          }
          return res.send({ result: 'OK', code: 200 }).status(200);
        } else {
          return res.send({ result: `User doesn't have a tasks with project id ${projectId}`, code: 404 }).status(404);
        }
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