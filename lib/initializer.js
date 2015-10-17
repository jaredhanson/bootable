/**
 * Module dependencies.
 */
var debug = require('debug')('bootable');

var init = exports = module.exports = {};

init.init = function() {
  this._phases = [];
};

// TODO: support thisArg
init.phase = function(fn, thisArg) {
  this._phases.push([fn, thisArg]);
  return this;
};

init.run = function(cb) {
  var phases = this._phases
    , idx = 0;
  
  function next(err) {
    if (err) { return cb(err); }
    
    var phase = phases[idx++];
    // all done
    if (!phase) { return cb(); }
    
    try {
      if (typeof phase[0] == 'object') {
        // TODO: Reimplement support for this
        //debug('%s', phase.constructor ? phase.constructor.name + '#boot' : 'anonymous#boot');
        //phase.boot(next);
      } else {
        debug('%s', phase[0].name || 'anonymous');
        var arity = phase[0].length;
        if (arity == 1) {
          phase[0].call(phase[1], next);
        } else {
          phase[0].call(phase[1]);
          next();
        }
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
};


return;
// TODO: Old code below here, can be removed.


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
      if (typeof phase == 'object') {
        debug('%s', phase.constructor ? phase.constructor.name + '#boot' : 'anonymous#boot');
        phase.boot(next);
      } else {
        debug('%s', phase.name || 'anonymous');
        var arity = phase.length;
        if (arity == 1) {
          phase.call(thisArg, next);
        } else {
          phase.call(thisArg);
          next();
        }
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
 * The phase may also be an object that has a `boot` function.  In this case,
 * the object's boot function will be called during the boot sequence.  This is
 * typically used for objects that need to establish a persistent connection,
 * for example to a database or message queue.
 *
 * @param {Function|Object} fn
 * @returns {Initializer} `this`, for a fluent interface.
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
