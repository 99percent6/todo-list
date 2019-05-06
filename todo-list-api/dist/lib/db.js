'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var db = function () {
  function db(_ref) {
    var config = _ref.config,
        _db = _ref.db;

    _classCallCheck(this, db);

    this.config = config;
    this.db = _db;
    this.usersCollectionName = 'users';
    this.tasksCollectionName = 'todo-list';
  }

  _createClass(db, [{
    key: 'findByField',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
        var field = _ref3.field,
            _ref3$operator = _ref3.operator,
            operator = _ref3$operator === undefined ? '==' : _ref3$operator,
            value = _ref3.value,
            collection = _ref3.collection,
            sort = _ref3.sort;
        var query, answer, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!field || !value)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', { code: 404, result: 'Missing field or value' });

              case 2:
                _context.prev = 2;
                query = this.db.collection(collection).where(field, operator, value).get();

                if (sort) {
                  query = this.db.collection(collection).where(field, operator, value).orderBy(sort.field, sort.value).get();
                }
                _context.next = 7;
                return query;

              case 7:
                answer = _context.sent;
                result = [];

                if (!(answer && answer.docs && answer.docs.length)) {
                  _context.next = 14;
                  break;
                }

                answer.docs.forEach(function (doc) {
                  var data = doc.data();
                  Object.assign(data, { id: doc.id });
                  result.push(data);
                });
                return _context.abrupt('return', { code: 200, result: result });

              case 14:
                return _context.abrupt('return', { code: 404, result: 'Not found' });

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](2);

                console.error(_context.t0);
                return _context.abrupt('return', { code: 500, result: _context.t0 });

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 17]]);
      }));

      function findByField(_x) {
        return _ref2.apply(this, arguments);
      }

      return findByField;
    }()
  }, {
    key: 'registerUser',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
        var encriptedPassword, dbUser, dbEmail, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(!user.login || !user.password)) {
                  _context2.next = 3;
                  break;
                }

                console.error('Login or password is missing during registration');
                return _context2.abrupt('return', { code: 404, result: 'Missing login or password' });

              case 3:
                encriptedPassword = _cryptoJs2.default.AES.encrypt(user.password, this.config.db.secretKey).toString();

                Object.assign(user, { password: encriptedPassword });
                _context2.prev = 5;
                _context2.next = 8;
                return this.findByField({ field: 'login', value: user.login, collection: this.usersCollectionName });

              case 8:
                dbUser = _context2.sent;
                _context2.next = 11;
                return this.findByField({ field: 'email', value: user.email, collection: this.usersCollectionName });

              case 11:
                dbEmail = _context2.sent;

                if (!(dbUser && dbUser.code === 200)) {
                  _context2.next = 16;
                  break;
                }

                return _context2.abrupt('return', { code: 500, result: 'Login busy' });

              case 16:
                if (!(dbEmail && dbEmail.code === 200)) {
                  _context2.next = 20;
                  break;
                }

                return _context2.abrupt('return', { code: 500, result: 'Email busy' });

              case 20:
                _context2.next = 22;
                return this.db.collection(this.usersCollectionName).add(user);

              case 22:
                result = _context2.sent;
                return _context2.abrupt('return', { code: 200, result: result.id });

              case 24:
                _context2.next = 30;
                break;

              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2['catch'](5);

                console.error(_context2.t0);
                return _context2.abrupt('return', { code: 500, result: _context2.t0 });

              case 30:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 26]]);
      }));

      function registerUser(_x2) {
        return _ref4.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: 'checkUserLogin',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(login) {
        var dbUser;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (user.login) {
                  _context3.next = 3;
                  break;
                }

                console.error('User login is missing');
                return _context3.abrupt('return', { code: 404, result: 'Missing user login' });

              case 3:
                _context3.prev = 3;
                _context3.next = 6;
                return this.findByField({ field: 'login', value: login, collection: this.usersCollectionName });

              case 6:
                dbUser = _context3.sent;

                if (!(dbUser && dbUser.code === 404)) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt('return', { code: 200, result: 'OK' });

              case 11:
                return _context3.abrupt('return', { code: 500, result: 'Login busy' });

              case 12:
                _context3.next = 18;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3['catch'](3);

                console.error(_context3.t0);
                return _context3.abrupt('return', { code: 500, result: _context3.t0 });

              case 18:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 14]]);
      }));

      function checkUserLogin(_x3) {
        return _ref5.apply(this, arguments);
      }

      return checkUserLogin;
    }()
  }, {
    key: 'checkUserEmail',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(email) {
        var dbUser;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (user.email) {
                  _context4.next = 3;
                  break;
                }

                console.error('Email login is missing');
                return _context4.abrupt('return', { code: 404, result: 'Missing user email' });

              case 3:
                _context4.prev = 3;
                _context4.next = 6;
                return this.findByField({ field: 'email', value: email, collection: this.usersCollectionName });

              case 6:
                dbUser = _context4.sent;

                if (!(dbUser && dbUser.code === 404)) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt('return', { code: 200, result: 'OK' });

              case 11:
                return _context4.abrupt('return', { code: 500, result: 'Email busy' });

              case 12:
                _context4.next = 18;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4['catch'](3);

                console.error(_context4.t0);
                return _context4.abrupt('return', { code: 500, result: _context4.t0 });

              case 18:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 14]]);
      }));

      function checkUserEmail(_x4) {
        return _ref6.apply(this, arguments);
      }

      return checkUserEmail;
    }()
  }, {
    key: 'getUser',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref8) {
        var login = _ref8.login;

        var result, _user;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (login) {
                  _context5.next = 3;
                  break;
                }

                console.error('Login is required field');
                return _context5.abrupt('return', { code: 404, result: 'Login is required field' });

              case 3:
                _context5.prev = 3;
                _context5.next = 6;
                return this.findByField({ field: 'login', value: login, collection: this.usersCollectionName });

              case 6:
                result = _context5.sent;

                if (!(result && result.code === 200 && result.result.length)) {
                  _context5.next = 13;
                  break;
                }

                _user = result.result.find(function (e) {
                  return e.login === login;
                });

                if (_user && _user.password) {
                  _user.password = _cryptoJs2.default.AES.decrypt(_user.password, this.config.db.secretKey).toString(_cryptoJs2.default.enc.Utf8);
                }
                return _context5.abrupt('return', { code: result.code, result: _user });

              case 13:
                return _context5.abrupt('return', { code: result.code, result: 'User not found' });

              case 14:
                _context5.next = 20;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5['catch'](3);

                console.error(_context5.t0);
                return _context5.abrupt('return', { code: 500, result: _context5.t0 });

              case 20:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 16]]);
      }));

      function getUser(_x5) {
        return _ref7.apply(this, arguments);
      }

      return getUser;
    }()
  }, {
    key: 'getTasks',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref10) {
        var userId = _ref10.userId;
        var sort, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (userId) {
                  _context6.next = 3;
                  break;
                }

                console.error('User id is required field');
                return _context6.abrupt('return', { code: 404, result: 'User id is required field' });

              case 3:
                _context6.prev = 3;
                sort = { field: 'createdAt', value: 'desc' };
                _context6.next = 7;
                return this.findByField({ field: 'author', value: userId, collection: this.tasksCollectionName, sort: sort });

              case 7:
                result = _context6.sent;

                if (!(result && result.code === 200 && result.result.length)) {
                  _context6.next = 12;
                  break;
                }

                return _context6.abrupt('return', result);

              case 12:
                return _context6.abrupt('return', { code: result.code, result: [] });

              case 13:
                _context6.next = 19;
                break;

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6['catch'](3);

                console.error(_context6.t0);
                return _context6.abrupt('return', { code: 500, result: _context6.t0 });

              case 19:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 15]]);
      }));

      function getTasks(_x6) {
        return _ref9.apply(this, arguments);
      }

      return getTasks;
    }()
  }, {
    key: 'addTask',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref12) {
        var task = _ref12.task;
        var result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (task) {
                  _context7.next = 3;
                  break;
                }

                console.error('Task is required field');
                return _context7.abrupt('return', { code: 404, result: 'Task is required field' });

              case 3:
                _context7.prev = 3;
                _context7.next = 6;
                return this.db.collection(this.tasksCollectionName).add(task);

              case 6:
                result = _context7.sent;

                if (!result) {
                  _context7.next = 11;
                  break;
                }

                return _context7.abrupt('return', { code: 200, result: result.id });

              case 11:
                return _context7.abrupt('return', { code: 500, result: "Task doesn't add" });

              case 12:
                _context7.next = 18;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7['catch'](3);

                console.error(_context7.t0);
                return _context7.abrupt('return', { code: 500, result: _context7.t0 });

              case 18:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[3, 14]]);
      }));

      function addTask(_x7) {
        return _ref11.apply(this, arguments);
      }

      return addTask;
    }()
  }, {
    key: 'deleteTask',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref14) {
        var id = _ref14.id;
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (id) {
                  _context8.next = 3;
                  break;
                }

                console.error('Task id is required field');
                return _context8.abrupt('return', { code: 404, result: 'Task id is required field' });

              case 3:
                _context8.prev = 3;
                _context8.next = 6;
                return this.db.collection(this.tasksCollectionName).doc(id).delete();

              case 6:
                result = _context8.sent;
                return _context8.abrupt('return', { code: 200, result: 'OK' });

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8['catch'](3);

                console.error(_context8.t0);
                return _context8.abrupt('return', { code: 500, result: _context8.t0 });

              case 14:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[3, 10]]);
      }));

      function deleteTask(_x8) {
        return _ref13.apply(this, arguments);
      }

      return deleteTask;
    }()
  }, {
    key: 'updateTask',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_ref16) {
        var task = _ref16.task;
        var result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (task) {
                  _context9.next = 3;
                  break;
                }

                console.error('Task is required field');
                return _context9.abrupt('return', { code: 404, result: 'Task is required field' });

              case 3:
                _context9.prev = 3;
                _context9.next = 6;
                return this.db.collection(this.tasksCollectionName).doc(task.id).update(task);

              case 6:
                result = _context9.sent;
                return _context9.abrupt('return', { code: 200, result: 'OK' });

              case 10:
                _context9.prev = 10;
                _context9.t0 = _context9['catch'](3);

                console.error(_context9.t0);
                return _context9.abrupt('return', { code: 500, result: _context9.t0 });

              case 14:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[3, 10]]);
      }));

      function updateTask(_x9) {
        return _ref15.apply(this, arguments);
      }

      return updateTask;
    }()
  }]);

  return db;
}();

exports.default = db;
//# sourceMappingURL=db.js.map