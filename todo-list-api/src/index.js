import express from 'express';
import api from './api';
import { db } from './db';
import config from '../config/config.json';

const app = express();
const port = 8080;

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.use('/api', api({ config, db }));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});