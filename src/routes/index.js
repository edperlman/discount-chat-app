// Import necessary modules
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { validateRegistration } = require('../middleware/validators');
const { authenticateToken } = require('../middleware/authenticate'); // Import authentication middleware

// Home route
router.get('/', homeController.welcome);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// User registration route
router.post('/register', validateRegistration, registerUser);

// User login route
router.post('/login', loginUser);

// User profile route (protected)
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
