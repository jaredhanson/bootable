module.exports = function(done) {
  process.nextTick(function() {
    done(new Error('something went wrong'));
  });
};
