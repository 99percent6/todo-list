'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _user = require('./api/user');

var _user2 = _interopRequireDefault(_user);

var _tasks = require('./api/tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  api.use('/user', (0, _user2.default)({ config: config, db: db }));

  api.use('/tasks', (0, _tasks2.default)({ config: config, db: db }));

  return api;
};
//# sourceMappingURL=api.js.map