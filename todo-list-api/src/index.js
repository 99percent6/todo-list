#!/usr/bin/env node
import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import api from './api';
import { db, connection } from './db';
import config from '../config/config.json';

connection.connect();

const app = express();
const port = 8080;
const mysql = connection;

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.get('/', (request, response) => {
  response.send('Hello from Express!');
});

app.use('/api', api({ config, db, mysql }));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});