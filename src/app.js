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

// CORS configuration
const allowedOrigins = [
  'http://localhost:5000', // Local frontend
  'https://discount-chat-app.vercel.app' // Deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

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

// Updated POST /users route with debugging logs
app.post('/users', async (req, res) => {
  console.log('POST /users endpoint hit'); // Log when the endpoint is called
  console.log('Request Body:', req.body); // Log the data sent by the frontend

  const { name, email, password } = req.body;

  try {
    console.log('Attempting to create a new user...'); // Log before creating a user
    const user = await User.create({ name, email, password }); // Database operation
    console.log('User created successfully:', user); // Log the created user data

    res.status(201).json(user); // Send success response
  } catch (error) {
    console.error('Error creating user:', error); // Log the error details
    res.status(500).json({ message: 'Error creating user', error: error.message }); // Send error response
  }
});

module.exports = app;
