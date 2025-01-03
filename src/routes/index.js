// Import necessary modules
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { validateRegistration } = require('../middleware/validators');
const { authenticateToken } = require('../middleware/authenticate'); // Import authentication middleware
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware

// Debugging logs for imported functions
console.log('registerUser:', typeof registerUser);
console.log('loginUser:', typeof loginUser);
console.log('getUserProfile:', typeof getUserProfile);

// Home route
router.get('/', homeController.welcome);

// Users route for testing purposes (example data)
router.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// User registration route
router.post('/register', validateRegistration, registerUser);

// User login route
router.post('/login', loginUser);

// Set up rate limiter: maximum of 100 requests per 15 minutes
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

// User profile route (protected)
router.get('/profile', profileLimiter, authenticateToken, getUserProfile);

// Export the router
module.exports = router;
