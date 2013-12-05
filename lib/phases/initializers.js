/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , debug = require('debug')('bootable');


/**
 * Initializer execution phase.
 *
 * This phase will execute all initializer scripts in a directory, allowing the
 * application to initialize modules, including connecting to databases and
 * other network services.
 *
 * Examples:
 *
 *   app.phase(bootable.initializers());
 *
 *   app.phase(bootable.initializers('config/initializers'));
 *
 * @param {String|Object} options
 * @return {Function}
 * @api public
 */
module.exports = function(options) {
  if ('string' == typeof options) {
    options = { dirname: options };
  }
  options = options || {};
  var dirname = options.dirname || 'etc/init'
    , extensions = options.extensions || Object.keys(require.extensions).map(function(ext) { return ext; })
    , exts = extensions.map(function(ext) {
        if ('.' != ext[0]) { return ext; }
        return ext.slice(1);
      })
    , regex = new RegExp('\\.(' + exts.join('|') + ')$');
  
  return function initializers(done) {
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
              mod.call(self, next);
            } else {
              // Sync initializer.  Exported function will be invoked, with next
              // being called immediately.
              mod.call(self);
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
  };
};
