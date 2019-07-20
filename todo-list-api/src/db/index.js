import * as firebase from "firebase/app";
import 'firebase/firestore';
import config from '../../config/config.json';
import mysql from 'mysql';

export const connection = mysql.createConnection({
  host     : config.mysql.host,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database
});

const firebaseConfig = {
  apiKey: config.db.apiKey,
  projectId: config.db.projectId, 
  databaseURL: config.db.databaseURL
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();