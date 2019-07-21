'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _db = require('../lib/db');

var _db2 = _interopRequireDefault(_db);

var _uuidTokenGenerator = require('uuid-token-generator');

var _uuidTokenGenerator2 = _interopRequireDefault(_uuidTokenGenerator);

var _user = require('../helpers/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tokgen = new _uuidTokenGenerator2.default(256, _uuidTokenGenerator2.default.BASE58);

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db,
      mysql = _ref.mysql,
      redisClient = _ref.redisClient;

  var api = (0, _express.Router)();
  var database = new _db2.default({ config: config, db: db, mysql: mysql });

  api.post('/registration', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var user, login, password, repeatedPassword, name, email, isValidData, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              user = req.body;
              login = user.login, password = user.password, repeatedPassword = user.repeatedPassword, name = user.name, email = user.email;

              if (!(!login || !password || !repeatedPassword || !name || !email)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', res.send({ result: 'Missing required field', code: 500 }).status(500));

            case 4:
              isValidData = (0, _user.isValidRegistrationData)(user);

              if (!(isValidData.code !== 200)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt('return', res.send(isValidData).status(isValidData.code));

            case 7:
              _context.prev = 7;

              delete user.repeatedPassword;
              _context.next = 11;
              return database.registerUser(user);

            case 11:
              result = _context.sent;

              if (!(result.code === 200)) {
                _context.next = 16;
                break;
              }

              return _context.abrupt('return', res.send(result).status(result.code));

            case 16:
              return _context.abrupt('return', res.send(result).status(result.code));

            case 17:
              _context.next = 23;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context['catch'](7);

              console.error(_context.t0);
              res.send({ result: 'Internal error', code: 500 }).status(500);

            case 23:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[7, 19]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  api.post('/login', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var _req$body, login, password, result, user, userPassword, token, expire;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body = req.body, login = _req$body.login, password = _req$body.password;

              if (!(!login || !password)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return', res.send({ result: 'Missing required field', code: 500 }).status(500));

            case 3:
              _context2.prev = 3;
              _context2.next = 6;
              return database.getUser({ login: login });

            case 6:
              result = _context2.sent;

              if (!(result.code === 200)) {
                _context2.next = 19;
                break;
              }

              user = result.result;
              userPassword = user.password;

              if (!(userPassword === password)) {
                _context2.next = 16;
                break;
              }

              token = tokgen.generate();

              if (redisClient.isConnected()) {
                expire = 60 * 60 * 24 * 30;

                redisClient.set(token, user, expire);
              }
              return _context2.abrupt('return', res.send({ result: token, code: result.code }).status(result.code));

            case 16:
              return _context2.abrupt('return', res.send({ result: 'Forbidden.Wrong password', code: 403 }).status(403));

            case 17:
              _context2.next = 20;
              break;

            case 19:
              return _context2.abrupt('return', res.send(result).status(result.code));

            case 20:
              _context2.next = 26;
              break;

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2['catch'](3);

              console.error(_context2.t0);
              return _context2.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 26:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 22]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }());

  api.post('/logout', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var token;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              token = req.query.token;

              if (token) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt('return', res.send({ result: 'Missing required field', code: 500 }).status(500));

            case 3:
              if (!redisClient.isConnected()) {
                _context3.next = 8;
                break;
              }

              redisClient.removeBy(token);
              return _context3.abrupt('return', res.send({ result: 'OK', code: 200 }).status(200));

            case 8:
              console.error('Redis not connect');
              return _context3.abrupt('return', res.send({ result: 'Internal error', code: 500 }).status(500));

            case 10:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  }());

  api.get('/getUser', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var token, user, result;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              token = req.query.token;

              if (token) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt('return', res.send({ result: 'Missing required field', code: 500 }).status(500));

            case 3:
              _context4.prev = 3;
              _context4.next = 6;
              return redisClient.get(token);

            case 6:
              user = _context4.sent;

              if (!user) {
                _context4.next = 19;
                break;
              }

              _context4.next = 10;
              return database.getUser({ login: user.login });

            case 10:
              result = _context4.sent;

              if (!(result.code === 200)) {
                _context4.next = 16;
                break;
              }

              if (result.result.password) delete result.result.password;
              return _context4.abrupt('return', res.send({ result: result.result, code: result.code }).status(result.code));

            case 16:
              return _context4.abrupt('return', res.send(result).status(result.code));

            case 17:
              _context4.next = 20;
              break;

            case 19:
              return _context4.abrupt('return', res.send({ result: 'User not authorized', code: 401 }));

            case 20:
              _context4.next = 26;
              break;

            case 22:
              _context4.prev = 22;
              _context4.t0 = _context4['catch'](3);

              console.error(_context4.t0);
              res.send({ result: 'Internal error', code: 500 }).status(500);

            case 26:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[3, 22]]);
    }));

    return function (_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  }());

  api.post('/sendFeedback', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
      var data, title, content, email, result;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = req.body;
              title = data.title, content = data.content, email = data.email;

              if (!(!title || !content || !email)) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt('return', res.send({ result: 'Missing required field', code: 500 }).status(500));

            case 4:
              if ((0, _user.isValidEmail)(email)) {
                _context5.next = 6;
                break;
              }

              return _context5.abrupt('return', res.send({ result: 'Email is not valid', code: 500 }).status(500));

            case 6:
              _context5.next = 8;
              return database.sendFeedback({ data: data });

            case 8:
              result = _context5.sent;
              return _context5.abrupt('return', res.send(result).status(result.code));

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function (_x9, _x10) {
      return _ref6.apply(this, arguments);
    };
  }());

  return api;
};
//# sourceMappingURL=user.js.map