import * as firebase from "firebase/app";
import 'firebase/firestore';
import config from '../../config/config.json';

const firebaseConfig = {
  apiKey: config.db.apiKey,
  projectId: config.db.projectId, 
  databaseURL: config.db.databaseURL
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();