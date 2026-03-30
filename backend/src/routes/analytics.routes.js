const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', (req, res) => analyticsController.getDashboardData(req, res));

module.exports = router;
