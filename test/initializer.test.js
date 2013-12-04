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
    
    describe('that throws an exception', function() {
      var initializer = new Initializer();
      initializer.phase(function() {
        throw new Error('something went horribly wrong');
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
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
    
    describe('that calls done with error', function() {
      var initializer = new Initializer();
      initializer.phase(function(done) {
        process.nextTick(function() {
          return done(new Error('something went wrong'));
        });
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
    });
    
    describe('that throws an exception', function() {
      var initializer = new Initializer();
      initializer.phase(function(done) {
        throw new Error('something went horribly wrong');
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });
    });
    
  });
  
  describe('multiple phases', function() {
    
    describe('that complete successfully', function() {
      var initializer = new Initializer()
        , order = [];
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('1:' + name);
      });
      initializer.phase(function(done) {
        var self = this;
        process.nextTick(function() {
          var name = self !== global ? self.name : 'global';
          order.push('2:' + name);
          return done();
        })
      });
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('3:' + name);
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
        expect(order).to.have.length(3);
        expect(order[0]).to.equal('1:global');
        expect(order[1]).to.equal('2:global');
        expect(order[2]).to.equal('3:global');
      });
    });
    
    describe('that halt due to error', function() {
      var initializer = new Initializer()
        , order = [];
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('1:' + name);
      });
      initializer.phase(function(done) {
        var self = this;
        process.nextTick(function() {
          return done(new Error('something went wrong'));
        })
      });
      initializer.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('3:' + name);
      });
    
      var error;
    
      before(function(done) {
        initializer.run(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback with error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(1);
        expect(order[0]).to.equal('1:global');
      });
    });
    
  });
  
});
