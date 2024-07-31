const fs = require('fs');
const path = require('path');
const pino = require('pino');

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      destination: path.join(logsDir, 'app.log'),
      mkdir: true,
    },
  },
});

module.exports = logger;
