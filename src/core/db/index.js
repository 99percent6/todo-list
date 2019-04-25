import * as firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: '',
  projectId: '', 
  databaseURL: ''
};

firebase.initializeApp(firebaseConfig);

window.dbCollectionName = 'todo-list';

export const db = firebase.firestore();