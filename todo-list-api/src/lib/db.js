import CryptoJS from 'crypto-js';
import bodybuilder from 'bodybuilder';
import { Client } from '@elastic/elasticsearch';
import { has } from 'lodash';

const client = new Client({
  node: 'http://localhost:9200',
  requestTimeout: 5000,
  keepAlive: false,
  log: 'debug'
});

export default class db {
  constructor ({config, db, mysql}) {
    this.config = config;
    this.db = db;
    this.mysql = mysql;
    this.usersCollectionName = config.db.collectionName.users;
    this.tasksCollectionName = config.db.collectionName.tasks;
    this.feedbackCollectionName = config.db.collectionName.feedback;
    this.projectCollectionName = config.db.collectionName.projects;
  };

  prepareRecord (record) {
    let tempRecord = { ...record };
    for (let key in tempRecord) {
      tempRecord[key] = tempRecord[key] ? tempRecord[key] : null
    }
    return tempRecord;
  };

  esResponseHandler (response) {
    if (has(response, ['body', 'hits', 'hits'])) {
      let hits = [];
      response.body.hits.hits.forEach(item => {
        hits = [...hits, item._source];
      })
      return hits
    } else {
      return []
    }
  };

  async esSearchByQuery ({ query, entityType = 'task', from = 0, size = 50, sort = 'createdAt:desc' }) {
    if (!query) {
      query = bodybuilder().build();
    }

    const index = this.config.es.indexByType[entityType];

    if (!index) {
      console.error('Index not found');
      return { code: 500, result: 'Index not found' };
    }

    try {
      const esResult = await client.search({
        from,
        size,
        index,
        sort,
        body: query
      });
      const response = this.esResponseHandler(esResult);
      return { code: 200, result: response };
    } catch (error) {
      console.error(JSON.stringify(error));
      return { code: 500, result: error };
    }
  };

  mysqlSearchByQuery ({ query }) {
    return new Promise ((resolve, reject) => {
      this.mysql.query(query, function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject({ code: 500, result: 'Internal error' });
        }

        if (results && results.length) {
          return resolve({ code: 200, result: results });
        } else {
          return resolve({ code: 404, result: 'Not found' });
        }
      });
    }).catch(err => {
      throw new Error(err);
    })
  }

  async addRecordMysql ({ table, record }) {
    return new Promise((resolve, reject) => {
      if (!table || !record) {
        return reject({ code: 404, result: 'Missing field or value' });
      }

      let preparedRecord = this.prepareRecord(record);
      delete preparedRecord.id;
      const command = `INSERT INTO ${table} SET ?`;
      this.mysql.query(command, preparedRecord, (err, results) => {
        if (err) {
          console.error(err);
          return reject({ code: 500, result: err });
        }

        return resolve({ code: 200, result: results });
      })
    })
  };

  async addDocumentEs ({ index, record }) {
    if (!index || !record) {
      return { code: 404, result: 'Missing field or value' };
    }

    try {
      const result = await client.create({
        index,
        id: record.id,
        refresh: true,
        body: record
      });

      return { code: 200, result: result.body };
    } catch (error) {
      console.error(JSON.stringify(error));
      return { code: 500, result: error };
    }
  };

  updateRecordMysql ({ query, values }) {
    return new Promise((resolve, reject) => {
      if (!query || !values) {
        return reject({ code: 404, result: 'Missing field or value' });
      }

      this.mysql.query(query, values, (err, results) => {
        if (err) {
          console.error(err);
          return reject({ code: 500, result: err });
        }

        return resolve({ code: 200, result: 'OK' });
      })
    });
  };

  async updateDocumentEs ({ index, record }) {
    if (!index || !record) {
      return { code: 404, result: 'Missing field or value' };
    }

    try {
      await client.update({
        index,
        id: record.id,
        refresh: true,
        body: {
          doc: record
        }
      });

      return { code: 200, result: 'OK' };
    } catch (error) {
      console.error(JSON.stringify(error));
      return { code: 500, result: error };
    }
  };

  async deleteByIdMysql ({ id, table }) {
    if (!id || !table) {
      return { code: 404, result: 'Missing field or value' };
    }

    this.mysql.query(`DELETE FROM ${table} WHERE id = ${id}`, (error, result) => {
      if (error) {
        console.error(error);
        return { code: 500, result: error };
      }
      return { code: 200, result: 'OK' };
    })
  };

  async deleteByIdEs ({ id, index }) {
    if (!id || !index) {
      return { code: 404, result: 'Missing field or value' };
    }

    try {
      await client.delete({
        index,
        id,
        refresh: true
      });
      return { code: 200, result: 'OK' };
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async registerUser (user) {
    if (!user.login || !user.password) {
      console.error('Login or password is missing during registration');
      return { code: 404, result: 'Missing login or password' };
    }
    const encriptedPassword = CryptoJS.AES.encrypt(user.password, this.config.db.secretKey).toString();
    Object.assign(user, { password: encriptedPassword });
    try {
      const dbUser = await this.mysqlSearchByQuery({ query: `SELECT login FROM users WHERE login = '${user.login}'` });
      const dbEmail = await this.mysqlSearchByQuery({ query: `SELECT email FROM users WHERE email = '${user.email}'` });

      if (dbUser && dbUser.code === 200) {
        return { code: 500, result: 'Login busy' };
      } else if (dbEmail && dbEmail.code === 200) {
        return { code: 500, result: 'Email busy' };
      } else {
        const result = await this.addRecordMysql({ table: 'users', record: user });
        return { code: 200, result: result.result.insertId };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getUser ({ login }) {
    if (!login) {
      console.error('Login is required field');
      return { code: 404, result: 'Login is required field' };
    }

    try {
      const result = await this.mysqlSearchByQuery({ query: `SELECT * FROM users WHERE login='${login}'` });

      if (result.code === 200 && result.result.length) {
        let user = result.result.find(e => e.login === login);
        user.password = CryptoJS.AES.decrypt(user.password, this.config.db.secretKey).toString(CryptoJS.enc.Utf8);
        return { code: result.code, result: user };
      } else {
        return { code: 404, result: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getAllUsers () {
    try {
      const tasks = await this.db.collection(this.usersCollectionName).get();
      let result = [];
      
      tasks.docs.forEach(doc => {
        let data = doc.data();
        result.push(data);
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  async getTasks ({ value, field = 'author', sortField = 'createdAt',  sortValue = 'desc' }) {
    if (!value) {
      console.error('Value is required field');
      return { code: 404, result: 'Value is required field' };
    }
    try {
      let query = bodybuilder().query('term', field, value).build();
      const result = await this.esSearchByQuery({
        query,
        entityType: 'task',
        sort: `${sortField}:${sortValue}`,
        size: 200
      });

      return result;
    } catch (error) {
      console.error(JSON.stringify(error));
      return { code: 500, result: error };
    }
  };

  async getAllTasks () {
    try {
      const tasks = await this.db.collection(this.tasksCollectionName).get();
      let result = [];
      
      tasks.docs.forEach(doc => {
        let data = doc.data();
        result.push(data);
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  async addTask ({ task }) {
    if (!task) {
      console.error('Task is required field');
      return { code: 404, result: 'Task is required field' };
    }
    try {
      const preparedTask = this.prepareRecord(task);
      const taskForMysql = {
        ...preparedTask,
        project: preparedTask.project ? preparedTask.project.id : preparedTask.project
      };

      const mysqlRecord = await this.addRecordMysql({ table: 'tasks', record: taskForMysql });
      let taskWithId = { ...preparedTask, id: mysqlRecord.result.insertId };
      const esRecord = await this.addDocumentEs({ index: 'tasks', record: taskWithId });

      if (esRecord) {
        return { code: 200, result: esRecord.result._id };
      } else {
        return { code: 500, result: "Task doesn't add" };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async deleteTask ({ id }) {
    if (!id) {
      console.error('Task id is required field');
      return { code: 404, result: 'Task id is required field' };
    }
    try {
      await this.deleteByIdMysql({ id, table: 'tasks' });
      await this.deleteByIdEs({ id, index: 'tasks' });

      return { code: 200, result: 'OK' };
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async updateTask ({ task }) {
    if (!task) {
      console.error('Task is required field');
      return { code: 404, result: 'Task is required field' };
    }
    try {
      const preparedTask = this.prepareRecord(task);
      const taskForMysql = {
        ...preparedTask,
        project: preparedTask.project ? preparedTask.project.id : preparedTask.project
      };

      await this.updateRecordMysql({ query: `UPDATE tasks SET ? WHERE id = '${task.id}'`, values: taskForMysql });
      await this.updateDocumentEs({ index: 'tasks', record: preparedTask });

      return { code: 200, result: 'OK' };
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async sendFeedback ({ data }) {
    if (!data) {
      console.error('Missing required fields');
      return { code: 404, result: 'Missing required fields' };
    }
    try {
      const result = await this.addRecordMysql({ table: 'feedback', record: data });

      if (result) {
        return { code: 200, result: result.result.insertId };
      } else {
        return { code: 500, result: "Feedback doesn't add" };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getAllFeedbacks () {
    try {
      const tasks = await this.db.collection(this.feedbackCollectionName).get();
      let result = [];
      
      tasks.docs.forEach(doc => {
        let data = doc.data();
        result.push(data);
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  async createProject ({ project }) {
    if (!project) {
      console.error('Missing required fields');
      return { code: 404, result: 'Missing required fields' };
    }
    try {
      const mysqlRecord = await this.addRecordMysql({ table: 'projects', record: project });
      let projectWithId = { ...project, id: mysqlRecord.result.insertId };
      const esRecord = await this.addDocumentEs({ index: 'projects', record: projectWithId });

      if (esRecord) {
        return { code: 200, result: esRecord.result._id };
      } else {
        return { code: 500, result: "Project doesn't add" };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getProjects ({ userId }) {
    if (!userId) {
      console.error('User id is required field');
      return { code: 404, result: 'User id is required field' };
    }
    try {
      let query = bodybuilder().query('term', 'author', userId).build();
      const result = await this.esSearchByQuery({
        query,
        entityType: 'project'
      })

      return result;
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getAllProjects () {
    try {
      const tasks = await this.db.collection(this.projectCollectionName).get();
      let result = [];
      
      tasks.docs.forEach(doc => {
        let data = doc.data();
        result.push(data);
      });

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  async deleteProject ({ id }) {
    if (!id) {
      console.error('Project id is required field');
      return { code: 404, result: 'Project id is required field' };
    }
    try {
      await this.deleteByIdMysql({ id, table: 'projects' });
      await this.deleteByIdEs({ id, index: 'projects' });

      return { code: 200, result: 'OK' };
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };
}