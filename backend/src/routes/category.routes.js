const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// Any authenticated user can view categories
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

// Only ADMIN can create, update, delete categories
router.post('/', authorize('ADMIN'), (req, res) => categoryController.createCategory(req, res));
router.put('/:id', authorize('ADMIN'), (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', authorize('ADMIN'), (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;
