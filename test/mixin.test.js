var bootable = require('..');

describe('mixin', function() {
    
  it('should export function', function() {
    expect(bootable).to.be.a('function');
  });
  
  describe('mixing into application', function() {
    var app = new Object();
    app.name = 'AppFoo';
    
    bootable(app);
    
    it('should mixin phase function', function() {
      expect(app.phase).to.be.a('function');
    });
    
    it('should mixin boot function', function() {
      expect(app.boot).to.be.a('function');
    });
    
    describe('registering and running phases', function() {
      var order = [];
      
      app.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('1:' + name);
      });
      app.phase(function(done) {
        var self = this;
        process.nextTick(function() {
          var name = self !== global ? self.name : 'global';
          order.push('2:' + name);
          return done();
        })
      });
      app.phase(function() {
        var name = this !== global ? this.name : 'global';
        order.push('3:' + name);
      });
      
      
      var error;
    
      before(function(done) {
        app.boot(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(3);
        expect(order[0]).to.equal('1:AppFoo');
        expect(order[1]).to.equal('2:AppFoo');
        expect(order[2]).to.equal('3:AppFoo');
      });
    });
  });
  
  describe('mixing in with phases', function() {
    var app = new Object();
    app.name = 'AppFoo';
    var order = [];
    
    function phase1() {
      var name = this !== global ? this.name : 'global';
      order.push('1:' + name);
    }
    function phase2(done) {
      var self = this;
      process.nextTick(function() {
        var name = self !== global ? self.name : 'global';
        order.push('2:' + name);
        return done();
      })
    }
    function phase3() {
      var name = this !== global ? this.name : 'global';
      order.push('3:' + name);
    }
    
    bootable(app, phase1, phase2, phase3);
    
    describe('running phases', function() {
      var error;
    
      before(function(done) {
        app.boot(function(err) {
          error = err;
          return done();
        });
      })
    
      it('should call callback', function() {
        expect(error).to.be.undefined;
      });
      it('should run phases in correct order', function() {
        expect(order).to.have.length(3);
        expect(order[0]).to.equal('1:AppFoo');
        expect(order[1]).to.equal('2:AppFoo');
        expect(order[2]).to.equal('3:AppFoo');
      });
    });
  });
  
});
