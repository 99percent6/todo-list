import { Router } from 'express';
import Database from '../lib/db';
import TokenGenerator from 'uuid-token-generator';
import { isValidRegistrationData, isValidEmail } from '../helpers/user';

const tokgen = new TokenGenerator(256, TokenGenerator.BASE58);

export default ({ config, db, mysql, redisClient }) => {
  const api = Router();
  const database = new Database({ config, db, mysql });

  api.post('/registration', async function(req, res) {
    let user = req.body;
    const { login, password, repeatedPassword, name, email } = user;
    if (!login || !password || !repeatedPassword || !name || !email) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    const isValidData = isValidRegistrationData(user);
    if (isValidData.code !== 200) {
      return res.send(isValidData).status(isValidData.code);
    }
    try {
      delete user.repeatedPassword;
      const result = await database.registerUser(user);
      if (result.code === 200) {
        return res.send(result).status(result.code);
      } else {
        return res.send(result).status(result.code);
      }
    } catch (error) {
      console.error(error);
      res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.post('/login', async function(req, res) {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    try {
      const result = await database.getUser({ login });

      if (result.code === 200) {
        const user = result.result;
        const userPassword = user.password;
        if (userPassword === password) {
          const token = tokgen.generate();
          if (redisClient.isConnected()) {
            const expire = 60 * 60 * 24 * 30;
            redisClient.set(token, user, expire);
          }
          return res.send({ result: token, code: result.code }).status(result.code);
        } else {
          return res.send({result: 'Forbidden.Wrong password', code: 403}).status(403);
        }
      } else {
        return res.send(result).status(result.code);
      }
    } catch (error) {
      console.error(error);
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.post('/logout', async function(req, res) {
    const token = req.query.token;
    if (!token) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    if (redisClient.isConnected()) {
      redisClient.removeBy(token);
      return res.send({ result: 'OK', code: 200 }).status(200);
    } else {
      console.error('Redis not connect');
      return res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.get('/getUser', async function(req, res) {
    const token = req.query.token;
    if (!token) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    try {
      const user = await redisClient.get(token);
      if (user) {
        const result = await database.getUser({ login: user.login });
        if (result.code === 200) {
          if (result.result.password) delete result.result.password;
          return res.send({result: result.result, code: result.code}).status(result.code);
        } else {
          return res.send(result).status(result.code);
        }
      } else {
        return res.send({ result: 'User not authorized', code: 401 });
      }
    } catch (error) {
      console.error(error);
      res.send({ result: 'Internal error', code: 500 }).status(500);
    }
  });

  api.post('/sendFeedback', async function(req, res) {
    const data = req.body;
    const { title, content, email } = data;
    if (!title || !content || !email) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
    }
    if (!isValidEmail(email)) {
      return res.send({result: 'Email is not valid', code: 500}).status(500);
    }
    const result = await database.sendFeedback({ data });
    return res.send(result).status(result.code);
  });

  return api;
};