require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('../src/models');
const logger = require('../shared/logger'); // Replace with your logger middleware if exists

// Import routes
const userRoutes = require('../modules/Users/routes/userRoutes');

const app = express();

// Database connection
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database connected and synchronized');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger); // Replace with actual logger if required

// Route registration
console.log('Registering routes...');
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error caught in middleware:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
