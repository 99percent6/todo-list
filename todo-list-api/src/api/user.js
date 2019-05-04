import { Router } from 'express';
import Database from '../lib/db';
import Redis from '../lib/redis';
import TokenGenerator from 'uuid-token-generator';

const redisClient = new Redis({ expire: 3600 });
const tokgen = new TokenGenerator(256, TokenGenerator.BASE58);

export default ({ config, db }) => {
  const api = Router();
  const database = new Database({ config, db });

  api.post('/registration', async function(req, res) {
    let user = req.body;
    const { login, password, repeatedPassword, name, email } = user;
    if (!login || !password || !repeatedPassword || !name || !email) {
      return res.send({result: 'Missing required field', code: 500}).status(500);
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
      res.send('Internal error').status(500);
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
      return res.send('Internal error').status(500);
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
      res.send('Internal error').status(500);
    }
  });

  return api;
};