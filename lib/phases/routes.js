var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  

module.exports = function(options, thisArg) {
  if ('string' == typeof options) {
    options = { filename: options }
  }
  options = options || {};
  var filename = options.filename || 'routes.js';
  
  // TODO: Check for supported extensions (.coffee, etc)
  
  return function routes(done) {
    var file = path.resolve(filename);
    if (!existsSync(file)) { return done(); }
    require(file).call(thisArg);
    done();
  }
}
