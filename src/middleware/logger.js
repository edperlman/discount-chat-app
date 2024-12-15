const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  };
  
  const config = require('../../config/config.js');

  module.exports = logger;
  