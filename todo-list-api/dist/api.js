'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _user = require('./api/user');

var _user2 = _interopRequireDefault(_user);

var _tasks = require('./api/tasks');

var _tasks2 = _interopRequireDefault(_tasks);

var _projects = require('./api/projects');

var _projects2 = _interopRequireDefault(_projects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db,
      mysql = _ref.mysql,
      redisClient = _ref.redisClient;

  var api = (0, _express.Router)();

  api.use('/user', (0, _user2.default)({ config: config, db: db, mysql: mysql, redisClient: redisClient }));

  api.use('/tasks', (0, _tasks2.default)({ config: config, db: db, mysql: mysql, redisClient: redisClient }));

  api.use('/projects', (0, _projects2.default)({ config: config, db: db, mysql: mysql, redisClient: redisClient }));

  return api;
};
//# sourceMappingURL=api.js.map