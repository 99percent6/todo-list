import { connection } from '../db';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'http://localhost:9200',
  requestTimeout: 1000 * 60 * 60,
  keepAlive: false,
  log: 'debug'
});

connection.connect();
const alias = 'tasks'
const indexName = `tasks_${Date.now()}`;
const entityType = 'task';
let indexNames = [];

async function migrateTasks () {
  try {
    const index = await client.indices.exists({
      index: alias
    });
    
    if (index.body) {
      const indexes = await client.indices.stats({
        index: '_all'
      });
      if (indexes.statusCode === 200) {
        indexNames = Object.keys(indexes.body.indices);
      }
      syncTasks();
    } else {
      const createIndex = await client.indices.create({
        index: indexName
      });

      if (createIndex.statusCode === 200) {
        syncTasks();
      } else {
        console.error('Error create index - ', indexName);
      }
    }
  } catch (error) {
    console.log('Error - ', error);
    closeProcess();
  }
}

function syncTasks () {
  connection.query('SELECT * FROM tasks', function (error, tasks, fields) {
    if (error) throw error;
    if (tasks && tasks.length) {
      console.log('Received tasks - ', tasks.length);
      connection.query('SELECT * FROM projects', function (error, projects, fields) {
        if (error) throw error;
        console.log('Received projects - ', projects.length);
        tasks.forEach(task => {
          const project = projects.find(itm => itm.id === task.project);
          if (project) {
            task.project = project;
          }
        });
        createDocuments(tasks);
      })
    } else {
      console.log('No tasks in mysql');
      closeProcess();
    }
  })
}

async function createDocuments (tasks) {
  if (!tasks || !tasks.length) {
    console.error('Tasks is missing');
    closeProcess();
  }

  try {
    for (let task of tasks) {
      await client.create({
        id: task.id,
        index: indexName,
        type: entityType,
        body: task
      });
      console.log(`Task with id ${task.id} created in elasticsearch index`);
    }
  
    if (indexNames.length) {
      const filteredIndexNames = indexNames.filter(name => name !== indexName && name.search(alias) !== -1);
      for (let name of filteredIndexNames) {
        await client.indices.delete({
          index: name
        })
      }
      console.log('Old index removed');
    }

    await client.indices.putAlias({
      index: indexName,
      name: alias
    });
    console.log('Alias for new index established');

    console.log('Sync tasks is done');
    closeProcess();
  } catch (error) {
    console.error(JSON.stringify(error));
    closeProcess();
  }
}

function closeProcess () {
  connection.end();
  process.exit(1);
}

migrateTasks();