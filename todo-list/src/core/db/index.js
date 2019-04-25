import * as firebase from "firebase/app";
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyABS8ktswxCcXGVmjRNKOdw6EbMh2MCEbg',
  projectId: 'todo-200d0', 
  databaseURL: 'https://todo-200d0.firebaseio.com'
};

firebase.initializeApp(firebaseConfig);

window.dbCollectionName = 'todo-list';

export const db = firebase.firestore();