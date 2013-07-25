/**
 * Module dependencies.
 */
var Initializer = require('./initializer');


/**
 * Create initializer.
 *
 * @return {Initializer}
 * @api public
 */
function create() {
  var ini = new Initializer();
  for (var i = 0; i < arguments.length; ++i) {
    ini.phase(arguments[i]);
  }
  return ini;
}

/**
 * Expose create() as the module.
 */
exports = module.exports = create;
exports.create = create;

exports.initializers = require('./phases/initializers');
exports.routes = require('./phases/routes');
