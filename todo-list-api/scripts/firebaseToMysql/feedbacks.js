import { db } from '../../src/db';
import Database from '../../src/lib/db';
import config from '../../config/config.json';
import { connection } from '../db';

const database = new Database({ config, db });

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    connectToMysql();
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

async function migrateFeedbacks () {
  const feedbacks = await database.getAllFeedbacks();

  if (feedbacks.length) {
    const feedbacksLength = feedbacks.length;
    let counter = 0;
    feedbacks.forEach(feedback => {

      const command = 'INSERT INTO feedback SET ?'
      connection.query(command, feedback, function (error, results, fields) {
        if (error) {
          console.error('Feedback with error - ', feedback);
          throw error;
        }
        counter++
        console.log('The solution is: ', results);
        if (counter === feedbacksLength) {
          connection.end();
          console.log('Connection closed');
          process.exit(1);
        }
      });
    });
  } else {
    console.log('No feedbacks');
    process.exit(-1);
  }
}

migrateFeedbacks();