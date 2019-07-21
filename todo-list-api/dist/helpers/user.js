'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidEmail = exports.isObject = exports.isValidRegistrationData = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isValidRegistrationData = exports.isValidRegistrationData = function isValidRegistrationData(userData) {
  if (!userData) {
    return { code: 500, result: 'Missing required data' };
  }
  if (isObject(userData)) {
    var requiredFields = ['login', 'password', 'repeatedPassword', 'email', 'name'];
    for (var key in userData) {
      if (requiredFields.includes(key)) {
        if (key === 'login') {
          var isValidLogin = !_validator2.default.isEmpty(userData[key]) && _validator2.default.isAlphanumeric(userData[key]);
          if (!isValidLogin) {
            return { code: 500, result: 'Not valid login' };
          }
        } else if (key === 'password') {
          var isValidPassword = !_validator2.default.isAlpha(userData[key], ['ru-RU']) && !_validator2.default.isEmpty(userData[key]) && userData[key].length >= 6;
          if (!isValidPassword) {
            return { code: 500, result: 'Not valid password' };
          }
        } else if (key === 'repeatedPassword') {
          var isEqualPasswords = _validator2.default.equals(userData[key], userData.password) && !_validator2.default.isEmpty(userData[key]);
          if (!isEqualPasswords) {
            return { code: 500, result: 'Passwords do not match' };
          }
        } else if (key === 'email') {
          var validEmail = isValidEmail(userData[key]);
          if (!validEmail) {
            return { code: 500, result: 'Not valid email' };
          }
        } else if (key === 'name') {
          var isValidName = !_validator2.default.isEmpty(userData[key]);
          if (!isValidName) {
            return { code: 500, result: 'Not valid name' };
          }
        }
      } else {
        return { code: 500, result: 'Not valid data composition' };
      }
    }
    return { code: 200, result: 'OK' };
  } else {
    return { code: 500, result: 'Wrond data type' };
  }
};

var isObject = exports.isObject = function isObject(obj) {
  if (!obj) {
    return false;
  }
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj)) {
    return true;
  } else {
    return false;
  }
};

var isValidEmail = exports.isValidEmail = function isValidEmail(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  var validEmail = _validator2.default.isEmail(value) && !_validator2.default.isEmpty(value);
  return validEmail;
};
//# sourceMappingURL=user.js.map