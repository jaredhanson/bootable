var debug = require('debug')('initialize');

function Initializer() {
  this._phases = [];
}

Initializer.prototype.init = function(app, cb) {
  var self = this
    , phases = this._phases
    , idx = 0;
  
  function next(err) {
    if (err) { return cb(err); }
    
    var phase = phases[idx++];
    // all done
    if (!phase) { return cb && cb(); }
    
    try {
      debug('%s', phase.name || 'anonymous');
      var arity = phase.length;
      if (arity == 1) {
        phase(next);
      } else {
        phase();
        next();
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
}

Initializer.prototype.phase = function(fn) {
  this._phases.push(fn);
}


module.exports = Initializer;
