const express = require('express');
const app = express();
const routes = require('./routes');

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Use the logger in
const logger = require('./middleware/logger');
app.use(logger);

// a simple error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

module.exports = app;
