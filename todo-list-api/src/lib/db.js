import CryptoJS from 'crypto-js';

export default class db {
  constructor({config, db}) {
    this.config = config;
    this.db = db;
    this.usersCollectionName = 'users';
  }

  async findByField({ field, operator = '==', value }) {
    if (!field || !value) {
      return { code: 404, message: 'Missing field or value' };
    }
    try {
      const answer = await this.db.collection(this.usersCollectionName).where(field, operator, value).get();
      let result = [];
      if (answer && answer.docs && answer.docs.length) {
        answer.docs.forEach(doc => {
          let data = doc.data();
          Object.assign(data, { id: doc.id });
          result.push(data);
        })
        return { code: 200, result };
      } else {
        return { code: 404, message: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: error };
    }
  }

  async registerUser(user) {
    if (!user.login || !user.password) {
      console.error('Login or password is missing during registration');
      return { code: 404, message: 'Missing login or password' };
    }
    const encriptedPassword = CryptoJS.AES.encrypt(user.password, this.config.db.secretKey).toString();
    Object.assign(user, { password: encriptedPassword });
    try {
      const dbUser = await this.findByField({ field: 'login', value: user.login });
      if (dbUser && dbUser.code === 404) {
        const result = await this.db.collection(this.usersCollectionName).add(user);
        return { code: 200, result: result.id };
      } else {
        return { code: 500, message: 'Login busy' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: error };
    }
  }

  async getUser({ login }) {
    if (!login) {
      console.error('Login is required field');
      return { code: 404, message: 'Login is required field' };
    }
    try {
      const result = await this.findByField({ field: 'login', value: login });
      if (result && result.code === 200 && result.result.length) {
        let user = result.result.find(e => e.login === login);
        if (user && user.password) {
          user.password = CryptoJS.AES.decrypt(user.password, this.config.db.secretKey).toString(CryptoJS.enc.Utf8);
        }
        return { code: result.code, result: user };
      } else {
        return { code: result.code, message: 'User not found' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, message: error };
    }
  }
}