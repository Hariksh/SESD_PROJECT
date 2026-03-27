const BaseController = require('../core/base.controller');
const categoryService = require('../services/category.service');

class CategoryController extends BaseController {
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            return this.sendSuccess(res, categories);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return this.sendError(res, 'Category not found', 404);
            }
            return this.sendSuccess(res, category);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            return this.sendSuccess(res, category, 'Category created successfully', 201);
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            return this.sendSuccess(res, category, 'Category updated successfully');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            return this.sendSuccess(res, null, 'Category deleted successfully');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }
}

module.exports = new CategoryController();
