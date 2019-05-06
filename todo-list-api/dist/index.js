#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _db = require('./db');

var _config = require('../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = 8081;

app.use(_bodyParser2.default.json({
  limit: _config2.default.bodyLimit
}));

app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.use((0, _cors2.default)());

app.get('/', function (request, response) {
  response.send('Hello from Express!');
});

app.use('/api', (0, _api2.default)({ config: _config2.default, db: _db.db }));

app.listen(port, function (err) {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log('Server is listening on ' + port);
});
//# sourceMappingURL=index.js.map