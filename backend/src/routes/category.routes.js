const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', (req, res) => categoryController.getAllCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

router.post('/', authorize('ADMIN'), (req, res) => categoryController.createCategory(req, res));
router.put('/:id', authorize('ADMIN'), (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', authorize('ADMIN'), (req, res) => categoryController.deleteCategory(req, res));

module.exports = router;
