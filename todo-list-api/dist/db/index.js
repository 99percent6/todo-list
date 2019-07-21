'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = exports.connection = undefined;

var _app = require('firebase/app');

var firebase = _interopRequireWildcard(_app);

require('firebase/firestore');

var _config = require('../../config/config.json');

var _config2 = _interopRequireDefault(_config);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var connection = exports.connection = _mysql2.default.createConnection({
  host: _config2.default.mysql.host,
  user: _config2.default.mysql.user,
  password: _config2.default.mysql.password,
  database: _config2.default.mysql.database
});

var firebaseConfig = {
  apiKey: _config2.default.db.apiKey,
  projectId: _config2.default.db.projectId,
  databaseURL: _config2.default.db.databaseURL
};

firebase.initializeApp(firebaseConfig);

var db = exports.db = firebase.firestore();
//# sourceMappingURL=index.js.map