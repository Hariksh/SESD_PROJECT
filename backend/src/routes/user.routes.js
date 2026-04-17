const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// All user management routes require JWT + Admin role
router.use(protect, admin);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.patch('/:id/role', (req, res) => userController.updateUserRole(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

module.exports = router;
