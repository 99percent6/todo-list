'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _redisJsonify = require('redis-jsonify');

var _redisJsonify2 = _interopRequireDefault(_redisJsonify);

var _config = require('../../config/config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RedisWrapper = function () {
  function RedisWrapper(params) {
    var _this = this;

    _classCallCheck(this, RedisWrapper);

    this.instance = (0, _redisJsonify2.default)(_redis2.default.createClient(_config2.default.redis));
    this.expirePeriod = params.expire || 86400;
    _redisJsonify2.default.blacklist.push('expire');

    this.connected = '';
    this.instance.on('error', function (error) {
      _this.connected = false;
      console.error('Redis connection error', error.message);
    }).on('ready', function () {
      console.log('Redis connected');
      _this.connected = true;
    });
  }

  _createClass(RedisWrapper, [{
    key: 'set',
    value: function set(key, value, expireTime) {
      this.instance.set(key, value);
      this.instance.expire(key, expireTime || this.expirePeriod);
    }
  }, {
    key: 'setExpireTime',
    value: function setExpireTime(cacheKey, seconds) {
      this.instance.expire(cacheKey, seconds);
    }
  }, {
    key: 'get',
    value: function get(cacheKey) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.isConnected()) {
          return _this2.instance.get(cacheKey, function (err, reply) {
            return resolve(reply || null);
          });
        } else {
          console.error('Redis disconnected...');
          return resolve(null);
        }
      });
    }
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return this.connected;
    }
  }, {
    key: 'removeBy',
    value: function removeBy(key) {
      this.instance.del(key);
    }
  }]);

  return RedisWrapper;
}();

module.exports = RedisWrapper;
//# sourceMappingURL=redis.js.map