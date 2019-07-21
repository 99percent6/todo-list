'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _db = require('../lib/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db,
      mysql = _ref.mysql,
      redisClient = _ref.redisClient;

  var api = (0, _express.Router)();
  var database = new _db2.default({ config: config, db: db, mysql: mysql });

  api.get('/list', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var _req$query, token, field, value, sort, user, userId, result, sortField, sortValue;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$query = req.query, token = _req$query.token, field = _req$query.field, value = _req$query.value, sort = _req$query.sort;

              if (token) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', res.send({ result: 'Token is required field', code: 500 }).status(500));

            case 3:
              _context.prev = 3;
              _context.next = 6;
              return redisClient.get(token);

            case 6:
              user = _context.sent;

              if (!user) {
                _context.next = 28;
                break;
              }

              userId = user.id;
              result = void 0;
              sortField = sort.split(':')[0];
              sortValue = sort.split(':')[1];

              if (!(field && value)) {
                _context.next = 18;
                break;
              }

              _context.next = 15;
              return database.getTasks({ value: value, field: field, sortField: sortField, sortValue: sortValue });

            case 15:
              result = _context.sent;
              _context.next = 21;
              break;

            case 18:
              _context.next = 20;
              return database.getTasks({ value: userId, sortField: sortField, sortValue: sortValue });

            case 20:
              result = _context.sent;

            case 21:
              if (!(result && result.code === 200)) {
                _context.next = 25;
                break;
              }

              return _context.abrupt('return', res.send(result).status(result.code));

            case 25:
              return _context.abrupt('return', res.send(result).status(404));

            case 26:
              _context.next = 29;
              break;

            case 28:
              return _context.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 29:
              _context.next = 35;
              break;

            case 31:
              _context.prev = 31;
              _context.t0 = _context['catch'](3);

              console.error(_context.t0);
              return _context.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 35:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 31]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  api.put('/addTask', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var token, task, user, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              token = req.query.token;
              task = req.body;

              if (!(!task || !token)) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 4:
              _context2.prev = 4;
              _context2.next = 7;
              return redisClient.get(token);

            case 7:
              user = _context2.sent;

              if (!user) {
                _context2.next = 16;
                break;
              }

              task = _extends({}, task, {
                author: user.id,
                createdAt: Date.now()
              });

              _context2.next = 12;
              return database.addTask({ task: task });

            case 12:
              result = _context2.sent;
              return _context2.abrupt('return', res.send(result).status(result.code));

            case 16:
              return _context2.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 17:
              _context2.next = 23;
              break;

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2['catch'](4);

              console.error(_context2.t0);
              return _context2.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 23:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[4, 19]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }());

  api.delete('/deleteTask', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var token, id, user, result;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              token = req.query.token;
              id = req.body.id;

              if (!(!token || !id)) {
                _context3.next = 4;
                break;
              }

              return _context3.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 4:
              _context3.prev = 4;
              _context3.next = 7;
              return redisClient.get(token);

            case 7:
              user = _context3.sent;

              if (!user) {
                _context3.next = 15;
                break;
              }

              _context3.next = 11;
              return database.deleteTask({ id: id });

            case 11:
              result = _context3.sent;
              return _context3.abrupt('return', res.send(result).status(result.code));

            case 15:
              return _context3.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 16:
              _context3.next = 22;
              break;

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3['catch'](4);

              console.error(_context3.t0);
              return _context3.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 22:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[4, 18]]);
    }));

    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());

  api.delete('/deleteByProjectId', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var _req$query2, token, projectId, user, tasksList, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, task, result;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _req$query2 = req.query, token = _req$query2.token, projectId = _req$query2.projectId;

              if (!(!token || !projectId)) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 3:
              _context4.prev = 3;
              _context4.next = 6;
              return redisClient.get(token);

            case 6:
              user = _context4.sent;

              if (!user) {
                _context4.next = 45;
                break;
              }

              _context4.next = 10;
              return database.getTasks({ value: projectId, field: 'project.id' });

            case 10:
              tasksList = _context4.sent;

              if (!(tasksList.code === 200 && tasksList.result.length)) {
                _context4.next = 42;
                break;
              }

              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context4.prev = 15;
              _iterator = tasksList.result[Symbol.iterator]();

            case 17:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context4.next = 25;
                break;
              }

              task = _step.value;
              _context4.next = 21;
              return database.deleteTask({ id: task.id });

            case 21:
              result = _context4.sent;

            case 22:
              _iteratorNormalCompletion = true;
              _context4.next = 17;
              break;

            case 25:
              _context4.next = 31;
              break;

            case 27:
              _context4.prev = 27;
              _context4.t0 = _context4['catch'](15);
              _didIteratorError = true;
              _iteratorError = _context4.t0;

            case 31:
              _context4.prev = 31;
              _context4.prev = 32;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 34:
              _context4.prev = 34;

              if (!_didIteratorError) {
                _context4.next = 37;
                break;
              }

              throw _iteratorError;

            case 37:
              return _context4.finish(34);

            case 38:
              return _context4.finish(31);

            case 39:
              return _context4.abrupt('return', res.send({ result: 'OK', code: 200 }).status(200));

            case 42:
              return _context4.abrupt('return', res.send({ result: 'User doesn\'t have a tasks with project id ' + projectId, code: 404 }).status(404));

            case 43:
              _context4.next = 46;
              break;

            case 45:
              return _context4.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 46:
              _context4.next = 52;
              break;

            case 48:
              _context4.prev = 48;
              _context4.t1 = _context4['catch'](3);

              console.error(_context4.t1);
              return _context4.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 52:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[3, 48], [15, 27, 31, 39], [32,, 34, 38]]);
    }));

    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }());

  api.put('/updateTask', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
      var token, task, user, result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              token = req.query.token;
              task = req.body;

              if (!(!token || !task)) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 4:
              _context5.prev = 4;
              _context5.next = 7;
              return redisClient.get(token);

            case 7:
              user = _context5.sent;

              if (!user) {
                _context5.next = 15;
                break;
              }

              _context5.next = 11;
              return database.updateTask({ task: task });

            case 11:
              result = _context5.sent;
              return _context5.abrupt('return', res.send(result).status(result.code));

            case 15:
              return _context5.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 16:
              _context5.next = 22;
              break;

            case 18:
              _context5.prev = 18;
              _context5.t0 = _context5['catch'](4);

              console.error(_context5.t0);
              return _context5.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 22:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this, [[4, 18]]);
    }));

    return function (_x9, _x10) {
      return _ref6.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=tasks.js.map