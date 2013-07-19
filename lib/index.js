/**
 * Module dependencies.
 */
var Initializer = require('./initializer');


var singleton = new Initializer();

function init(app, cb) {
  singleton.init(app, cb);
}

function phase(fn) {
  singleton.phase(fn);
}


/**
 * Expose initialize() as the module.
 */
exports = module.exports = init;
exports.init = init;
exports.phase = phase;

exports.initializers = require('./phases/initializers');
exports.routes = require('./phases/routes');
