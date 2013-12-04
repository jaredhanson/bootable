var Initializer = require('../lib/initializer');

describe('Initialzier', function() {
    
  describe('without phases', function() {
    var initializer = new Initializer();
    var error;
    
    before(function(done) {
      initializer.run(function(err) {
        error = err;
        return done();
      });
    })
    
    it('should call callback', function() {
      expect(error).to.be.undefined;
    });
  });
  
  describe('with sync phase', function() {
    
    describe('run without context', function() {
      var initializer = new Initializer()
        , order = [];
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('1:' + name);
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(1);
        expect(order[0]).to.equal('1:global');
      });
    });
    
    describe('run with context', function() {
      var initializer = new Initializer()
        , ctx = { name: 'local' }
        , order = [];
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('1:' + name);
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        }, ctx);
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(1);
        expect(order[0]).to.equal('1:local');
      });
    });
    
  });
  
  describe('with async phase', function() {
    
    describe('run without context', function() {
      var initializer = new Initializer()
        , order = [];
      initializer.phase(function(done) {
        var self = this;
        process.nextTick(function() {
          var name = self !== global ? self.name : 'global';
          order.push('1:' + name);
          return done();
        })
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(1);
        expect(order[0]).to.equal('1:global');
      });
    });
    
    describe('run with context', function() {
      var initializer = new Initializer()
        , ctx = { name: 'local' }
        , order = [];
      initializer.phase(function(done) {
        var self = this;
        process.nextTick(function() {
          var name = self !== global ? self.name : 'global';
          order.push('1:' + name);
          return done();
        })
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        }, ctx);
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(1);
        expect(order[0]).to.equal('1:local');
      });
    });
    
  });
  
});
