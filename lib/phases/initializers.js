var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  , debug = require('debug')('initialize');


module.exports = function(options, thisArg) {
  options = options || {};
  var dirname = options.dirname || 'init'
    , exts = Object.keys(require.extensions).map(function(ext) { return ext.slice(1); })
    , regex = new RegExp('\\.(' + exts.join('|') + ')$');
  
  return function(done) {
    var dir = path.resolve(dirname);
    if (!existsSync(dir)) { return done(); }
    
    var self = this
      , files = fs.readdirSync(dir).sort()
      , idx = 0;
  
    function next(err) {
      if (err) { return done(err); }
    
      var file = files[idx++];
      // all done
      if (!file) { return done(); }
    
      if (regex.test(file)) {
        try {
          debug('initializer %s', file);
          var mod = require(path.join(dir, file));
          if (typeof mod == 'function') {
            var arity = mod.length;
            if (arity == 1) {
              // Async initializer.  Exported function will be invoked, with next
              // being called when the initializer finishes.
              mod.call(thisArg, next);
            } else {
              // Sync initializer.  Exported function will be invoked, with next
              // being called immediately.
              mod.call(thisArg);
              next();
            }
          } else {
            // Initializer does not export a function.  Requiring the initializer
            // is sufficient to invoke it, next immediately.
            next();
          }
        } catch (ex) {
          next(ex);
        }
      } else {
        next();
      }
    }
    next();
  }
}
