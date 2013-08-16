/**
 * Module dependencies.
 */
var Initializer = require('./initializer');


exports = module.exports = function(app, phases) {
  phases = [].slice.call(arguments, 1);
  
  app._initializer = new Initializer();
  
  app.boot = function(cb) {
    this._initializer.init(cb);
  }
  
  app.phase = function(fn) {
    this._initializer.phase(fn);
    return this;
  }
  
  
  for (var i = 0; i < phases.length; ++i) {
    app.phase(phases[i]);
  }
  return app;
}


exports.Initializer = Initializer;

exports.initializers = require('./phases/initializers');
exports.routes = require('./phases/routes');
