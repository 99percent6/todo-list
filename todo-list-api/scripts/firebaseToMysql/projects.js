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

const users = {
  '0hk6xsBxdgKcQdw007vw': 1,
  '21KdCm9zgQkcyvdNKQ4m': 2,
  'AIichBuyzTtwhjdHuSks': 3,
  'Ul9q8DcJyrQvOuMO7iNe': 4,
  'pHopH0xKXrgMu3wWzuBy': 5
}

async function migrateProjects () {
  const projects = await database.getAllProjects();

  if (projects.length) {
    const projectLength = projects.length;
    let counter = 0;
    projects.forEach(project => {
      project.author = users[project.author];
      delete project.id;

      const command = 'INSERT INTO projects SET ?'
      connection.query(command, project, function (error, results, fields) {
        if (error) {
          console.error('Project with error - ', project);
          throw error;
        }
        counter++
        console.log('The solution is: ', results);
        if (counter === projectLength) {
          connection.end();
          console.log('Connection closed');
          process.exit(-1);
        }
      });
    });
  } else {
    console.log('No projects');
    process.exit(-1);
  }
}

migrateProjects();