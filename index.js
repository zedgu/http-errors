var util = require('util');
var statuses = require('statuses');

function httpError (msg) {
  Error.captureStackTrace(this, httpError);
  this.message = msg || 'Error';
}
util.inherits(httpError, Error);
httpError.prototype.name = 'HTTP Error';

module.exports = function newError() {
  var err;
  var msg;
  var code = 500;
  var props = {};
  for (var i = arguments.length - 1; i >= 0; i--) {
    var arg = arguments[i];
    if (arg instanceof Error) {
      err = arg;
      code = err.statusCode || err.status || code;
      continue;
    }
    switch (typeof arg) {
      case 'string':
        msg = arg;
        break;
      case 'number':
        code = arg;
        break;
      case 'object':
        props = arg;
        break;
    }
  }

  if (!err) {
    err = new httpError(msg || statuses[code] || 'Unknow Error');
  }

  err.expose = code < 500;
  for (var key in props) err[key] = props[key];
  err.status = err.statusCode = code;
  return err;
};
