var scripts = require('scripts')
  , path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  

module.exports = function(options, thisArg) {
  if ('string' == typeof options) {
    options = { filename: options }
  }
  options = options || {};
  var filename = options.filename || 'routes'
    , extensions = options.extensions;
  
  return function routes(done) {
    var script = scripts.resolve(path.resolve(filename), extensions);
    
    if (!existsSync(script)) { return done(); }
    require(script).call(thisArg);
    done();
  }
}
