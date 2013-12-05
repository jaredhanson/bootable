var routes = require('../../lib/phases/routes');

describe('phases/routes', function() {
  
  it('should export a setup function', function() {
    expect(routes).to.be.a('function');
  });
  
  describe('phase with string argument', function() {
    var app = new Object();
    app.routes = {};
    app.get = function(path, handler) {
      app.routes[path] = handler;
    };
    
    var phase = routes(__dirname + '/../data/routes/test');
    phase.call(app);
    
    it('should draw routes', function() {
      expect(Object.keys(app.routes)).to.have.length(1);
      var handler = app.routes['/test'];
      expect(handler).to.be.a('function');
      expect(handler()).to.equal('GET /test');
    });
  });
  
  describe('phase with filename option', function() {
    var app = new Object();
    app.routes = {};
    app.get = function(path, handler) {
      app.routes[path] = handler;
    };
    
    var phase = routes({ filename: __dirname + '/../data/routes/test' });
    phase.apply(app);
    
    it('should draw routes', function() {
      expect(Object.keys(app.routes)).to.have.length(1);
      var handler = app.routes['/test'];
      expect(handler).to.be.a('function');
      expect(handler()).to.equal('GET /test');
    });
  });
  
});
