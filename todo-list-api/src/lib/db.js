import CryptoJS from 'crypto-js';

export default class db {
  constructor ({config, db}) {
    this.config = config;
    this.db = db;
    this.usersCollectionName = config.db.collectionName.users;
    this.tasksCollectionName = config.db.collectionName.tasks;
    this.feedbackCollectionName = config.db.collectionName.feedback;
    this.projectCollectionName = config.db.collectionName.projects;
  };

  async findByField ({ field, operator = '==', value, collection, sort }) {
    if (!field || !value) {
      return { code: 404, result: 'Missing field or value' };
    }
    try {
      let query = this.db.collection(collection).where(field, operator, value).get();
      if (sort) {
        query = this.db.collection(collection).where(field, operator, value).orderBy(sort.field, sort.value).get();
      }
      const answer = await query;
      let result = [];
      if (answer && answer.docs && answer.docs.length) {
        answer.docs.forEach(doc => {
          let data = doc.data();
          Object.assign(data, { id: doc.id });
          result.push(data);
        })
        return { code: 200, result };
      } else {
        return { code: 404, result: 'Not found' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async deleteById ({ id, collection = '' }) {
    if (!id || !collection) {
      return { code: 404, result: 'Missing field or value' };
    }
    try {
      const result = await this.db.collection(collection).doc(id).delete();
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
      const dbUser = await this.findByField({ field: 'login', value: user.login, collection: this.usersCollectionName });
      const dbEmail = await this.findByField({ field: 'email', value: user.email, collection: this.usersCollectionName });
      if (dbUser && dbUser.code === 200) {
        return { code: 500, result: 'Login busy' };
      } else if (dbEmail && dbEmail.code === 200) {
        return { code: 500, result: 'Email busy' };
      } else {
        const result = await this.db.collection(this.usersCollectionName).add(user);
        return { code: 200, result: result.id };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async checkUserLogin (login) {
    if (!user.login) {
      console.error('User login is missing');
      return { code: 404, result: 'Missing user login' };
    }
    try {
      const dbUser = await this.findByField({ field: 'login', value: login, collection: this.usersCollectionName });
      if (dbUser && dbUser.code === 404) {
        return { code: 200, result: 'OK' };
      } else {
        return { code: 500, result: 'Login busy' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async checkUserEmail (email) {
    if (!user.email) {
      console.error('Email login is missing');
      return { code: 404, result: 'Missing user email' };
    }
    try {
      const dbUser = await this.findByField({ field: 'email', value: email, collection: this.usersCollectionName });
      if (dbUser && dbUser.code === 404) {
        return { code: 200, result: 'OK' };
      } else {
        return { code: 500, result: 'Email busy' };
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
      const result = await this.findByField({ field: 'login', value: login, collection: this.usersCollectionName });
      if (result && result.code === 200 && result.result.length) {
        let user = result.result.find(e => e.login === login);
        if (user && user.password) {
          user.password = CryptoJS.AES.decrypt(user.password, this.config.db.secretKey).toString(CryptoJS.enc.Utf8);
        }
        return { code: result.code, result: user };
      } else {
        return { code: result.code, result: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async getTasks ({ value, field = 'author' }) {
    if (!value) {
      console.error('Value is required field');
      return { code: 404, result: 'Value is required field' };
    }
    try {
      const sort = { field: 'createdAt', value: 'desc' };
      const result = await this.findByField({ field, value, collection: this.tasksCollectionName, sort });
      if (result && result.code === 200 && result.result.length) {
        return result;
      } else if (result && result.code === 404) {
        return { code: 200, result: [] };
      } else {
        return { code: result.code, result: [] };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async addTask ({ task }) {
    if (!task) {
      console.error('Task is required field');
      return { code: 404, result: 'Task is required field' };
    }
    try {
      const result = await this.db.collection(this.tasksCollectionName).add(task);
      if (result) {
        return { code: 200, result: result.id };
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
      const result = await this.deleteById({ id, collection: this.tasksCollectionName });
      return result;
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
      const result = await this.db.collection(this.tasksCollectionName).doc(task.id).update(task);
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
      const result = await this.db.collection(this.feedbackCollectionName).add(data);
      if (result) {
        return { code: 200, result: result.id };
      } else {
        return { code: 500, result: "Task doesn't add" };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async createProject ({ project }) {
    if (!project) {
      console.error('Missing required fields');
      return { code: 404, result: 'Missing required fields' };
    }
    try {
      const result = await this.db.collection(this.projectCollectionName).add(project);
      if (result) {
        return { code: 200, result: result.id };
      } else {
        return { code: 500, result: "Project doesn't create" };
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
      const sort = { field: 'createdAt', value: 'desc' };
      const result = await this.findByField({ field: 'author', value: userId, collection: this.projectCollectionName, sort });
      if (result && result.code === 200 && result.result.length) {
        return result;
      } else if (result && result.code === 404) {
        return { code: 200, result: [] };
      } else {
        return { code: result.code, result: [] };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };

  async deleteProject ({ id }) {
    if (!id) {
      console.error('Project id is required field');
      return { code: 404, result: 'Project id is required field' };
    }
    try {
      const result = await this.deleteById({ id, collection: this.projectCollectionName });
      return result;
    } catch (error) {
      console.error(error);
      return { code: 500, result: error };
    }
  };
}