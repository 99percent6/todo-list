import { connection } from '../db';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'http://localhost:9200',
  requestTimeout: 1000 * 60 * 60,
  keepAlive: false,
  log: 'debug'
});

connection.connect();
const alias = 'projects'
const indexName = `projects_${Date.now()}`;
const entityType = 'project';
let indexNames = [];

async function migrateProjects () {
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
      syncProjects();
    } else {
      const createIndex = await client.indices.create({
        index: indexName
      });

      if (createIndex.statusCode === 200) {
        syncProjects();
      } else {
        console.error('Error create index - ', indexName);
      }
    }
  } catch (error) {
    console.log('Error - ', error);
    closeProcess();
  }
}

function syncProjects () {
  connection.query('SELECT * FROM projects', function (error, results, fields) {
    if (error) throw error;
    if (results && results.length) {
      console.log('Received projects - ', results.length);
      createDocuments(results);
    } else {
      console.log('No projects in mysql');
      closeProcess();
    }
  })
}

async function createDocuments (items) {
  if (!items || !items.length) {
    console.error('Projects is missing');
    closeProcess();
  }

  try {
    for (let item of items) {
      await client.create({
        id: item.id,
        index: indexName,
        type: entityType,
        body: item
      });
      console.log(`Project with id ${item.id} created in elasticsearch index`);
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

    console.log('Sync projects is done');
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

migrateProjects();