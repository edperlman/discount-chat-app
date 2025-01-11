const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticate, getUserProfile);

module.exports = router;