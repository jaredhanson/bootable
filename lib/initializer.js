/**
 * Module dependencies.
 */
var debug = require('debug')('bootable');


/**
 * Creates an instance of `Initializer`.
 *
 * @constructor
 * @api public
 */
function Initializer() {
  this._phases = [];
}

/**
 * Run all phases.
 *
 * When the initializer is run, all phases will be executed sequentially, in
 * the order in which they were registered.  Once complete, `cb` will be
 * invoked.
 *
 * @param {Function} cb
 * @param {Object} [thisArg]
 * @api public
 */
Initializer.prototype.run = function(cb, thisArg) {
  var phases = this._phases
    , idx = 0;
  
  function next(err) {
    if (err) { return cb(err); }
    
    var phase = phases[idx++];
    // all done
    if (!phase) { return cb(); }
    
    try {
      debug('%s', phase.name || 'anonymous');
      var arity = phase.length;
      if (arity == 1) {
        phase.call(thisArg, next);
      } else {
        phase.call(thisArg);
        next();
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
};

/**
 * Register a phase.
 *
 * A phase can be either synchronous or asynchronous.  Synchronous phases have
 * following function signature
 *
 *     function myPhase() {
 *       // perform initialization
 *     }
 *
 * Asynchronous phases have the following function signature.
 *
 *     function myAsyncPhase(done) {
 *       // perform initialization
 *       done();  // or done(err);
 *     }
 *
 * @param {Function} fn
 * @api public
 */
Initializer.prototype.phase = function(fn) {
  this._phases.push(fn);
  return this;
};


/**
 * Expose `Initializer`.
 */
module.exports = Initializer;
