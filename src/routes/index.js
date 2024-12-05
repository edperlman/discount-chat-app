const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Define routes
router.get('/', homeController.welcome);

router.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });
  

module.exports = router;
