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

const projects = {
  'proekt-2': 1,
  'obuchenie': 2,
  'the-tasker': 3,
  'rewqwer': 4,
  'mmm': 5,
  'proekt': 6,
  'dandir': 7
}

const users = {
  '0hk6xsBxdgKcQdw007vw': 1,
  '21KdCm9zgQkcyvdNKQ4m': 2,
  'AIichBuyzTtwhjdHuSks': 3,
  'Ul9q8DcJyrQvOuMO7iNe': 4,
  'pHopH0xKXrgMu3wWzuBy': 5
}

async function migrateTasks () {
  const tasks = await database.getAllTasks();

  if (tasks.length) {
    const taskLength = tasks.length;
    let counter = 0;
    tasks.forEach(task => {
      task.author = users[task.author];
      if (task.project) {
        task.project = projects[task.project.slug]
      }
      if (!task.project) {
        task.project = null;
      }
      if (!task.priority) {
        task.priority = null;
      }
      delete task.id;
      const command = 'INSERT INTO tasks SET ?'
      connection.query(command, task, function (error, results, fields) {
        if (error) {
          console.error('Task with error - ', task);
          throw error;
        }
        counter++
        console.log('The solution is: ', results);
        if (counter === taskLength) {
          connection.end();
          console.log('Connection closed');
          process.exit(-1);
        }
      });
    });
  } else {
    console.log('No tasks');
    process.exit(-1);
  }
}

migrateTasks();