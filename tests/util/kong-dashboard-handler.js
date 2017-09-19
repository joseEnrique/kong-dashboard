var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var KongDashboardHandler = function() {

  this.stderr = '';

  this.stdout = '';

  this.childProcess = null;

  this.start = (options, cbOnStart, cbOnExit) => {
    var port = options['-p'] || options['--port'] || 8080;
    var args = ['start'];
    for (var key in options) {
      args.push(key);
      Array.prototype.push.apply(args, options[key].split(" "));
    }
    this.childProcess = spawn('./bin/kong-dashboard.js', args);
    this.childProcess.stdout.on('data', (data) => {
      this.stdout += data.toString();
      if (data.toString().trim() == 'Kong Dashboard has started on port ' + port) {
        cbOnStart();
      }
    });
    this.childProcess.stderr.on('data', (data) => {
      this.stderr += data;
    });
    this.childProcess.on('exit', (code) => {
      if (cbOnExit) {
        cbOnExit(code);
      }
    });
  };

  this.stop = (cb) => {
    if (cb) {
      exec('kill ' + this.childProcess.pid, cb);
    } else {
      exec('kill ' + this.childProcess.pid);
    }
  }
};

module.exports = KongDashboardHandler;
