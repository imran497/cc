var fs = require('fs');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');

var logDirectory = __dirname+'/log';

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
  compress: 'gzip'
});

// setup the logger
module.exports = morgan('combined', {stream: accessLogStream});
