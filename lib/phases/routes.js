var path = require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // <=0.6
  

module.exports = function(options, thisArg) {
  options = options || {};
  var filename = options.filename || 'routes.js';
  
  return function(done) {
    var file = path.resolve(filename);
    if (!existsSync(file)) { return done(); }
    require(file).call(thisArg);
    done();
  }
}
