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
                _context.next = 15;
                break;
              }

              userId = user.id;
              _context.next = 11;
              return database.getProjects({ userId: userId });

            case 11:
              result = _context.sent;
              return _context.abrupt('return', res.send(result).status(result.code));

            case 15:
              return _context.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 16:
              _context.next = 22;
              break;

            case 18:
              _context.prev = 18;
              _context.t0 = _context['catch'](3);

              console.error(_context.t0);
              return _context.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 22:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[3, 18]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  api.post('/create', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var token, project, user, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              token = req.query.token;
              project = req.body;

              if (!(!token || !project)) {
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

              project = _extends({}, project, { author: user.id, createdAt: Date.now() });
              _context2.next = 12;
              return database.createProject({ project: project });

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

  api.delete('/delete', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var _req$query, token, id, user, result;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _req$query = req.query, token = _req$query.token, id = _req$query.id;

              if (!(!token || !id)) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt('return', res.send({ result: 'Missing required fields', code: 500 }).status(500));

            case 3:
              _context3.prev = 3;
              _context3.next = 6;
              return redisClient.get(token);

            case 6:
              user = _context3.sent;

              if (!user) {
                _context3.next = 14;
                break;
              }

              _context3.next = 10;
              return database.deleteProject({ id: id });

            case 10:
              result = _context3.sent;
              return _context3.abrupt('return', res.send(result).status(result.code));

            case 14:
              return _context3.abrupt('return', res.send({ result: 'User is not authorized', code: 401 }).status(401));

            case 15:
              _context3.next = 21;
              break;

            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3['catch'](3);

              console.error(_context3.t0);
              return _context3.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 21:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 17]]);
    }));

    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=projects.js.map