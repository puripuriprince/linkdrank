const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '..', 'logs', 'access.log'),
  { flags: 'a' }
);

const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

const httpLogger = morgan(logFormat, {
  stream: process.env.NODE_ENV === 'production' ? accessLogStream : process.stdout
});

module.exports = { httpLogger };
