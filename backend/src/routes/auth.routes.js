const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Bind methods to controller instance to maintain 'this' context
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

module.exports = router;
