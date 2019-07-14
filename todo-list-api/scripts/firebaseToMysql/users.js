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

async function migrateUsers () {
  const users = await database.getAllUsers();

  if (users.length) {
    const userLength = users.length;
    let counter = 0;
    users.forEach(user => {

      const command = 'INSERT INTO users SET ?'
      connection.query(command, user, function (error, results, fields) {
        if (error) {
          console.error('User with error - ', user);
          throw error;
        }
        counter++
        console.log('The solution is: ', results);
        if (counter === userLength) {
          connection.end();
          console.log('Connection closed');
          process.exit(-1);
        }
      });
    });
  } else {
    console.log('No users');
    process.exit(-1);
  }
}

migrateUsers();