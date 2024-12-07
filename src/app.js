require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Import CORS middleware
const { User } = require('./models');
const app = express();
const routes = require('./routes');
const config = require('../config/config.js');
const { sequelize } = require('./models');

// Sync the database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });


// Add CORS middleware
app.use(cors({ origin: 'http://localhost:5000' }));

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Use the logger in
const logger = require('./middleware/logger');
app.use(logger);

// A simple error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error); // Log the full error details
        res.status(500).json({ message: 'Error creating user', error: error.errors || error.message });
    }
});

module.exports = app;
