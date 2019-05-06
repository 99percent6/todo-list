'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _db = require('../lib/db');

var _db2 = _interopRequireDefault(_db);

var _redis = require('../lib/redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var redisClient = new _redis2.default({ expire: 3600 });

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();
  var database = new _db2.default({ config: config, db: db });

  api.get('/list', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var token, user, userId, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              token = req.query.token;

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
                _context.next = 19;
                break;
              }

              userId = user.id;
              _context.next = 11;
              return database.getTasks({ userId: userId });

            case 11:
              result = _context.sent;

              if (!(result && result.code === 200)) {
                _context.next = 16;
                break;
              }

              return _context.abrupt('return', res.send(result).status(result.code));

            case 16:
              return _context.abrupt('return', res.send(result).status(404));

            case 17:
              _context.next = 20;
              break;

            case 19:
              return _context.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 20:
              _context.next = 26;
              break;

            case 22:
              _context.prev = 22;
              _context.t0 = _context['catch'](3);

              console.error(_context.t0);
              return _context.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 26:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 22]]);
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

              task = _extends({}, task, { author: user.id });
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

  api.post('/deleteTask', function () {
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

  api.put('/updateTask', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var token, task, user, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              token = req.query.token;
              task = req.body;

              if (!(!token || !task)) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 4:
              _context4.prev = 4;
              _context4.next = 7;
              return redisClient.get(token);

            case 7:
              user = _context4.sent;

              if (!user) {
                _context4.next = 15;
                break;
              }

              _context4.next = 11;
              return database.updateTask({ task: task });

            case 11:
              result = _context4.sent;
              return _context4.abrupt('return', res.send(result).status(result.code));

            case 15:
              return _context4.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 16:
              _context4.next = 22;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4['catch'](4);

              console.error(_context4.t0);
              return _context4.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 22:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[4, 18]]);
    }));

    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=tasks.js.map