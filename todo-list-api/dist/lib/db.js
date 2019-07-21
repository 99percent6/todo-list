'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _bodybuilder = require('bodybuilder');

var _bodybuilder2 = _interopRequireDefault(_bodybuilder);

var _elasticsearch = require('@elastic/elasticsearch');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var client = new _elasticsearch.Client({
  node: 'http://localhost:9200',
  requestTimeout: 5000,
  keepAlive: false,
  log: 'debug'
});

var db = function () {
  function db(_ref) {
    var config = _ref.config,
        _db = _ref.db,
        mysql = _ref.mysql;

    _classCallCheck(this, db);

    this.config = config;
    this.db = _db;
    this.mysql = mysql;
    this.usersCollectionName = config.db.collectionName.users;
    this.tasksCollectionName = config.db.collectionName.tasks;
    this.feedbackCollectionName = config.db.collectionName.feedback;
    this.projectCollectionName = config.db.collectionName.projects;
  }

  _createClass(db, [{
    key: 'prepareRecord',
    value: function prepareRecord(record) {
      var tempRecord = _extends({}, record);
      for (var key in tempRecord) {
        tempRecord[key] = tempRecord[key] ? tempRecord[key] : null;
      }
      return tempRecord;
    }
  }, {
    key: 'esResponseHandler',
    value: function esResponseHandler(response) {
      if ((0, _lodash.has)(response, ['body', 'hits', 'hits'])) {
        var hits = [];
        response.body.hits.hits.forEach(function (item) {
          hits = [].concat(_toConsumableArray(hits), [item._source]);
        });
        return hits;
      } else {
        return [];
      }
    }
  }, {
    key: 'esSearchByQuery',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
        var query = _ref3.query,
            _ref3$entityType = _ref3.entityType,
            entityType = _ref3$entityType === undefined ? 'task' : _ref3$entityType,
            _ref3$from = _ref3.from,
            from = _ref3$from === undefined ? 0 : _ref3$from,
            _ref3$size = _ref3.size,
            size = _ref3$size === undefined ? 50 : _ref3$size,
            _ref3$sort = _ref3.sort,
            sort = _ref3$sort === undefined ? 'createdAt:desc' : _ref3$sort;
        var index, esResult, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!query) {
                  query = (0, _bodybuilder2.default)().build();
                }

                index = this.config.es.indexByType[entityType];

                if (index) {
                  _context.next = 5;
                  break;
                }

                console.error('Index not found');
                return _context.abrupt('return', { code: 500, result: 'Index not found' });

              case 5:
                _context.prev = 5;
                _context.next = 8;
                return client.search({
                  from: from,
                  size: size,
                  index: index,
                  sort: sort,
                  body: query
                });

              case 8:
                esResult = _context.sent;
                response = this.esResponseHandler(esResult);
                return _context.abrupt('return', { code: 200, result: response });

              case 13:
                _context.prev = 13;
                _context.t0 = _context['catch'](5);

                console.error(JSON.stringify(_context.t0));
                return _context.abrupt('return', { code: 500, result: _context.t0 });

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 13]]);
      }));

      function esSearchByQuery(_x) {
        return _ref2.apply(this, arguments);
      }

      return esSearchByQuery;
    }()
  }, {
    key: 'mysqlSearchByQuery',
    value: function mysqlSearchByQuery(_ref4) {
      var _this = this;

      var query = _ref4.query;

      return new Promise(function (resolve, reject) {
        _this.mysql.query(query, function (error, results, fields) {
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
      }).catch(function (err) {
        throw new Error(err);
      });
    }
  }, {
    key: 'addRecordMysql',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref6) {
        var _this2 = this;

        var table = _ref6.table,
            record = _ref6.record;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', new Promise(function (resolve, reject) {
                  if (!table || !record) {
                    return reject({ code: 404, result: 'Missing field or value' });
                  }

                  var preparedRecord = _this2.prepareRecord(record);
                  delete preparedRecord.id;
                  var command = 'INSERT INTO ' + table + ' SET ?';
                  _this2.mysql.query(command, preparedRecord, function (err, results) {
                    if (err) {
                      console.error(err);
                      return reject({ code: 500, result: err });
                    }

                    return resolve({ code: 200, result: results });
                  });
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function addRecordMysql(_x2) {
        return _ref5.apply(this, arguments);
      }

      return addRecordMysql;
    }()
  }, {
    key: 'addDocumentEs',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref8) {
        var index = _ref8.index,
            record = _ref8.record;
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!index || !record)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt('return', { code: 404, result: 'Missing field or value' });

              case 2:
                _context3.prev = 2;
                _context3.next = 5;
                return client.create({
                  index: index,
                  id: record.id,
                  refresh: true,
                  body: record
                });

              case 5:
                result = _context3.sent;
                return _context3.abrupt('return', { code: 200, result: result.body });

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](2);

                console.error(JSON.stringify(_context3.t0));
                return _context3.abrupt('return', { code: 500, result: _context3.t0 });

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 9]]);
      }));

      function addDocumentEs(_x3) {
        return _ref7.apply(this, arguments);
      }

      return addDocumentEs;
    }()
  }, {
    key: 'updateRecordMysql',
    value: function updateRecordMysql(_ref9) {
      var _this3 = this;

      var query = _ref9.query,
          values = _ref9.values;

      return new Promise(function (resolve, reject) {
        if (!query || !values) {
          return reject({ code: 404, result: 'Missing field or value' });
        }

        _this3.mysql.query(query, values, function (err, results) {
          if (err) {
            console.error(err);
            return reject({ code: 500, result: err });
          }

          return resolve({ code: 200, result: 'OK' });
        });
      });
    }
  }, {
    key: 'updateDocumentEs',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref11) {
        var index = _ref11.index,
            record = _ref11.record;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!index || !record)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt('return', { code: 404, result: 'Missing field or value' });

              case 2:
                _context4.prev = 2;
                _context4.next = 5;
                return client.update({
                  index: index,
                  id: record.id,
                  refresh: true,
                  body: {
                    doc: record
                  }
                });

              case 5:
                return _context4.abrupt('return', { code: 200, result: 'OK' });

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4['catch'](2);

                console.error(JSON.stringify(_context4.t0));
                return _context4.abrupt('return', { code: 500, result: _context4.t0 });

              case 12:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 8]]);
      }));

      function updateDocumentEs(_x4) {
        return _ref10.apply(this, arguments);
      }

      return updateDocumentEs;
    }()
  }, {
    key: 'deleteByIdMysql',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref13) {
        var id = _ref13.id,
            table = _ref13.table;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(!id || !table)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', { code: 404, result: 'Missing field or value' });

              case 2:

                this.mysql.query('DELETE FROM ' + table + ' WHERE id = ' + id, function (error, result) {
                  if (error) {
                    console.error(error);
                    return { code: 500, result: error };
                  }
                  return { code: 200, result: 'OK' };
                });

              case 3:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function deleteByIdMysql(_x5) {
        return _ref12.apply(this, arguments);
      }

      return deleteByIdMysql;
    }()
  }, {
    key: 'deleteByIdEs',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref15) {
        var id = _ref15.id,
            index = _ref15.index;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(!id || !index)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt('return', { code: 404, result: 'Missing field or value' });

              case 2:
                _context6.prev = 2;
                _context6.next = 5;
                return client.delete({
                  index: index,
                  id: id,
                  refresh: true
                });

              case 5:
                return _context6.abrupt('return', { code: 200, result: 'OK' });

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6['catch'](2);

                console.error(_context6.t0);
                return _context6.abrupt('return', { code: 500, result: _context6.t0 });

              case 12:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 8]]);
      }));

      function deleteByIdEs(_x6) {
        return _ref14.apply(this, arguments);
      }

      return deleteByIdEs;
    }()
  }, {
    key: 'registerUser',
    value: function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user) {
        var encriptedPassword, dbUser, dbEmail, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(!user.login || !user.password)) {
                  _context7.next = 3;
                  break;
                }

                console.error('Login or password is missing during registration');
                return _context7.abrupt('return', { code: 404, result: 'Missing login or password' });

              case 3:
                encriptedPassword = _cryptoJs2.default.AES.encrypt(user.password, this.config.db.secretKey).toString();

                Object.assign(user, { password: encriptedPassword });
                _context7.prev = 5;
                _context7.next = 8;
                return this.mysqlSearchByQuery({ query: 'SELECT login FROM users WHERE login = \'' + user.login + '\'' });

              case 8:
                dbUser = _context7.sent;
                _context7.next = 11;
                return this.mysqlSearchByQuery({ query: 'SELECT email FROM users WHERE email = \'' + user.email + '\'' });

              case 11:
                dbEmail = _context7.sent;

                if (!(dbUser && dbUser.code === 200)) {
                  _context7.next = 16;
                  break;
                }

                return _context7.abrupt('return', { code: 500, result: 'Login busy' });

              case 16:
                if (!(dbEmail && dbEmail.code === 200)) {
                  _context7.next = 20;
                  break;
                }

                return _context7.abrupt('return', { code: 500, result: 'Email busy' });

              case 20:
                _context7.next = 22;
                return this.addRecordMysql({ table: 'users', record: user });

              case 22:
                result = _context7.sent;
                return _context7.abrupt('return', { code: 200, result: result.result.insertId });

              case 24:
                _context7.next = 30;
                break;

              case 26:
                _context7.prev = 26;
                _context7.t0 = _context7['catch'](5);

                console.error(_context7.t0);
                return _context7.abrupt('return', { code: 500, result: _context7.t0 });

              case 30:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[5, 26]]);
      }));

      function registerUser(_x7) {
        return _ref16.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: 'getUser',
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref18) {
        var login = _ref18.login;
        var result, user;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (login) {
                  _context8.next = 3;
                  break;
                }

                console.error('Login is required field');
                return _context8.abrupt('return', { code: 404, result: 'Login is required field' });

              case 3:
                _context8.prev = 3;
                _context8.next = 6;
                return this.mysqlSearchByQuery({ query: 'SELECT * FROM users WHERE login=\'' + login + '\'' });

              case 6:
                result = _context8.sent;

                if (!(result.code === 200 && result.result.length)) {
                  _context8.next = 13;
                  break;
                }

                user = result.result.find(function (e) {
                  return e.login === login;
                });

                user.password = _cryptoJs2.default.AES.decrypt(user.password, this.config.db.secretKey).toString(_cryptoJs2.default.enc.Utf8);
                return _context8.abrupt('return', { code: result.code, result: user });

              case 13:
                return _context8.abrupt('return', { code: 404, result: 'User not found' });

              case 14:
                _context8.next = 20;
                break;

              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8['catch'](3);

                console.error(_context8.t0);
                return _context8.abrupt('return', { code: 500, result: _context8.t0 });

              case 20:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this, [[3, 16]]);
      }));

      function getUser(_x8) {
        return _ref17.apply(this, arguments);
      }

      return getUser;
    }()
  }, {
    key: 'getAllUsers',
    value: function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var tasks, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.db.collection(this.usersCollectionName).get();

              case 3:
                tasks = _context9.sent;
                result = [];


                tasks.docs.forEach(function (doc) {
                  var data = doc.data();
                  result.push(data);
                });

                return _context9.abrupt('return', result);

              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9['catch'](0);

                console.error(_context9.t0);

              case 12:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 9]]);
      }));

      function getAllUsers() {
        return _ref19.apply(this, arguments);
      }

      return getAllUsers;
    }()
  }, {
    key: 'getTasks',
    value: function () {
      var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(_ref21) {
        var value = _ref21.value,
            _ref21$field = _ref21.field,
            field = _ref21$field === undefined ? 'author' : _ref21$field,
            _ref21$sortField = _ref21.sortField,
            sortField = _ref21$sortField === undefined ? 'createdAt' : _ref21$sortField,
            _ref21$sortValue = _ref21.sortValue,
            sortValue = _ref21$sortValue === undefined ? 'desc' : _ref21$sortValue;
        var query, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (value) {
                  _context10.next = 3;
                  break;
                }

                console.error('Value is required field');
                return _context10.abrupt('return', { code: 404, result: 'Value is required field' });

              case 3:
                _context10.prev = 3;
                query = (0, _bodybuilder2.default)().query('term', field, value).build();
                _context10.next = 7;
                return this.esSearchByQuery({
                  query: query,
                  entityType: 'task',
                  sort: sortField + ':' + sortValue
                });

              case 7:
                result = _context10.sent;
                return _context10.abrupt('return', result);

              case 11:
                _context10.prev = 11;
                _context10.t0 = _context10['catch'](3);

                console.error(JSON.stringify(_context10.t0));
                return _context10.abrupt('return', { code: 500, result: _context10.t0 });

              case 15:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[3, 11]]);
      }));

      function getTasks(_x9) {
        return _ref20.apply(this, arguments);
      }

      return getTasks;
    }()
  }, {
    key: 'getAllTasks',
    value: function () {
      var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var tasks, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return this.db.collection(this.tasksCollectionName).get();

              case 3:
                tasks = _context11.sent;
                result = [];


                tasks.docs.forEach(function (doc) {
                  var data = doc.data();
                  result.push(data);
                });

                return _context11.abrupt('return', result);

              case 9:
                _context11.prev = 9;
                _context11.t0 = _context11['catch'](0);

                console.error(_context11.t0);

              case 12:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 9]]);
      }));

      function getAllTasks() {
        return _ref22.apply(this, arguments);
      }

      return getAllTasks;
    }()
  }, {
    key: 'addTask',
    value: function () {
      var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(_ref24) {
        var task = _ref24.task;
        var preparedTask, taskForMysql, mysqlRecord, taskWithId, esRecord;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (task) {
                  _context12.next = 3;
                  break;
                }

                console.error('Task is required field');
                return _context12.abrupt('return', { code: 404, result: 'Task is required field' });

              case 3:
                _context12.prev = 3;
                preparedTask = this.prepareRecord(task);
                taskForMysql = _extends({}, preparedTask, {
                  project: preparedTask.project ? preparedTask.project.id : preparedTask.project
                });
                _context12.next = 8;
                return this.addRecordMysql({ table: 'tasks', record: taskForMysql });

              case 8:
                mysqlRecord = _context12.sent;
                taskWithId = _extends({}, preparedTask, { id: mysqlRecord.result.insertId });
                _context12.next = 12;
                return this.addDocumentEs({ index: 'tasks', record: taskWithId });

              case 12:
                esRecord = _context12.sent;

                if (!esRecord) {
                  _context12.next = 17;
                  break;
                }

                return _context12.abrupt('return', { code: 200, result: esRecord.result._id });

              case 17:
                return _context12.abrupt('return', { code: 500, result: "Task doesn't add" });

              case 18:
                _context12.next = 24;
                break;

              case 20:
                _context12.prev = 20;
                _context12.t0 = _context12['catch'](3);

                console.error(_context12.t0);
                return _context12.abrupt('return', { code: 500, result: _context12.t0 });

              case 24:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[3, 20]]);
      }));

      function addTask(_x10) {
        return _ref23.apply(this, arguments);
      }

      return addTask;
    }()
  }, {
    key: 'deleteTask',
    value: function () {
      var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(_ref26) {
        var id = _ref26.id;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (id) {
                  _context13.next = 3;
                  break;
                }

                console.error('Task id is required field');
                return _context13.abrupt('return', { code: 404, result: 'Task id is required field' });

              case 3:
                _context13.prev = 3;
                _context13.next = 6;
                return this.deleteByIdMysql({ id: id, table: 'tasks' });

              case 6:
                _context13.next = 8;
                return this.deleteByIdEs({ id: id, index: 'tasks' });

              case 8:
                return _context13.abrupt('return', { code: 200, result: 'OK' });

              case 11:
                _context13.prev = 11;
                _context13.t0 = _context13['catch'](3);

                console.error(_context13.t0);
                return _context13.abrupt('return', { code: 500, result: _context13.t0 });

              case 15:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[3, 11]]);
      }));

      function deleteTask(_x11) {
        return _ref25.apply(this, arguments);
      }

      return deleteTask;
    }()
  }, {
    key: 'updateTask',
    value: function () {
      var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(_ref28) {
        var task = _ref28.task;
        var preparedTask, taskForMysql;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (task) {
                  _context14.next = 3;
                  break;
                }

                console.error('Task is required field');
                return _context14.abrupt('return', { code: 404, result: 'Task is required field' });

              case 3:
                _context14.prev = 3;
                preparedTask = this.prepareRecord(task);
                taskForMysql = _extends({}, preparedTask, {
                  project: preparedTask.project ? preparedTask.project.id : preparedTask.project
                });
                _context14.next = 8;
                return this.updateRecordMysql({ query: 'UPDATE tasks SET ? WHERE id = \'' + task.id + '\'', values: taskForMysql });

              case 8:
                _context14.next = 10;
                return this.updateDocumentEs({ index: 'tasks', record: preparedTask });

              case 10:
                return _context14.abrupt('return', { code: 200, result: 'OK' });

              case 13:
                _context14.prev = 13;
                _context14.t0 = _context14['catch'](3);

                console.error(_context14.t0);
                return _context14.abrupt('return', { code: 500, result: _context14.t0 });

              case 17:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this, [[3, 13]]);
      }));

      function updateTask(_x12) {
        return _ref27.apply(this, arguments);
      }

      return updateTask;
    }()
  }, {
    key: 'sendFeedback',
    value: function () {
      var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(_ref30) {
        var data = _ref30.data;
        var result;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (data) {
                  _context15.next = 3;
                  break;
                }

                console.error('Missing required fields');
                return _context15.abrupt('return', { code: 404, result: 'Missing required fields' });

              case 3:
                _context15.prev = 3;
                _context15.next = 6;
                return this.addRecordMysql({ table: 'feedback', record: data });

              case 6:
                result = _context15.sent;

                if (!result) {
                  _context15.next = 11;
                  break;
                }

                return _context15.abrupt('return', { code: 200, result: result.result.insertId });

              case 11:
                return _context15.abrupt('return', { code: 500, result: "Feedback doesn't add" });

              case 12:
                _context15.next = 18;
                break;

              case 14:
                _context15.prev = 14;
                _context15.t0 = _context15['catch'](3);

                console.error(_context15.t0);
                return _context15.abrupt('return', { code: 500, result: _context15.t0 });

              case 18:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this, [[3, 14]]);
      }));

      function sendFeedback(_x13) {
        return _ref29.apply(this, arguments);
      }

      return sendFeedback;
    }()
  }, {
    key: 'getAllFeedbacks',
    value: function () {
      var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
        var tasks, result;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                _context16.next = 3;
                return this.db.collection(this.feedbackCollectionName).get();

              case 3:
                tasks = _context16.sent;
                result = [];


                tasks.docs.forEach(function (doc) {
                  var data = doc.data();
                  result.push(data);
                });

                return _context16.abrupt('return', result);

              case 9:
                _context16.prev = 9;
                _context16.t0 = _context16['catch'](0);

                console.error(_context16.t0);

              case 12:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this, [[0, 9]]);
      }));

      function getAllFeedbacks() {
        return _ref31.apply(this, arguments);
      }

      return getAllFeedbacks;
    }()
  }, {
    key: 'createProject',
    value: function () {
      var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(_ref33) {
        var project = _ref33.project;
        var mysqlRecord, projectWithId, esRecord;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (project) {
                  _context17.next = 3;
                  break;
                }

                console.error('Missing required fields');
                return _context17.abrupt('return', { code: 404, result: 'Missing required fields' });

              case 3:
                _context17.prev = 3;
                _context17.next = 6;
                return this.addRecordMysql({ table: 'projects', record: project });

              case 6:
                mysqlRecord = _context17.sent;
                projectWithId = _extends({}, project, { id: mysqlRecord.result.insertId });
                _context17.next = 10;
                return this.addDocumentEs({ index: 'projects', record: projectWithId });

              case 10:
                esRecord = _context17.sent;

                if (!esRecord) {
                  _context17.next = 15;
                  break;
                }

                return _context17.abrupt('return', { code: 200, result: esRecord.result._id });

              case 15:
                return _context17.abrupt('return', { code: 500, result: "Project doesn't add" });

              case 16:
                _context17.next = 22;
                break;

              case 18:
                _context17.prev = 18;
                _context17.t0 = _context17['catch'](3);

                console.error(_context17.t0);
                return _context17.abrupt('return', { code: 500, result: _context17.t0 });

              case 22:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[3, 18]]);
      }));

      function createProject(_x14) {
        return _ref32.apply(this, arguments);
      }

      return createProject;
    }()
  }, {
    key: 'getProjects',
    value: function () {
      var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(_ref35) {
        var userId = _ref35.userId;
        var query, result;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (userId) {
                  _context18.next = 3;
                  break;
                }

                console.error('User id is required field');
                return _context18.abrupt('return', { code: 404, result: 'User id is required field' });

              case 3:
                _context18.prev = 3;
                query = (0, _bodybuilder2.default)().query('term', 'author', userId).build();
                _context18.next = 7;
                return this.esSearchByQuery({
                  query: query,
                  entityType: 'project'
                });

              case 7:
                result = _context18.sent;
                return _context18.abrupt('return', result);

              case 11:
                _context18.prev = 11;
                _context18.t0 = _context18['catch'](3);

                console.error(_context18.t0);
                return _context18.abrupt('return', { code: 500, result: _context18.t0 });

              case 15:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[3, 11]]);
      }));

      function getProjects(_x15) {
        return _ref34.apply(this, arguments);
      }

      return getProjects;
    }()
  }, {
    key: 'getAllProjects',
    value: function () {
      var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
        var tasks, result;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                _context19.next = 3;
                return this.db.collection(this.projectCollectionName).get();

              case 3:
                tasks = _context19.sent;
                result = [];


                tasks.docs.forEach(function (doc) {
                  var data = doc.data();
                  result.push(data);
                });

                return _context19.abrupt('return', result);

              case 9:
                _context19.prev = 9;
                _context19.t0 = _context19['catch'](0);

                console.error(_context19.t0);

              case 12:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this, [[0, 9]]);
      }));

      function getAllProjects() {
        return _ref36.apply(this, arguments);
      }

      return getAllProjects;
    }()
  }, {
    key: 'deleteProject',
    value: function () {
      var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(_ref38) {
        var id = _ref38.id;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (id) {
                  _context20.next = 3;
                  break;
                }

                console.error('Project id is required field');
                return _context20.abrupt('return', { code: 404, result: 'Project id is required field' });

              case 3:
                _context20.prev = 3;
                _context20.next = 6;
                return this.deleteByIdMysql({ id: id, table: 'projects' });

              case 6:
                _context20.next = 8;
                return this.deleteByIdEs({ id: id, index: 'projects' });

              case 8:
                return _context20.abrupt('return', { code: 200, result: 'OK' });

              case 11:
                _context20.prev = 11;
                _context20.t0 = _context20['catch'](3);

                console.error(_context20.t0);
                return _context20.abrupt('return', { code: 500, result: _context20.t0 });

              case 15:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[3, 11]]);
      }));

      function deleteProject(_x16) {
        return _ref37.apply(this, arguments);
      }

      return deleteProject;
    }()
  }]);

  return db;
}();

exports.default = db;
//# sourceMappingURL=db.js.map