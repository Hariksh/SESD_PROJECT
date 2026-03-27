const Category = require('../models/category.model');
const BaseService = require('../core/base.service');

class CategoryService extends BaseService {
    async getAllCategories() {
        return await Category.find({});
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async createCategory(categoryData) {
        const existing = await Category.findOne({ name: categoryData.name });
        if (existing) {
            throw new Error('Category already exists');
        }
        const category = new Category(categoryData);
        return await category.save();
    }

    async updateCategory(id, categoryData) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        Object.assign(category, categoryData);
        return await category.save();
    }

    async deleteCategory(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.deleteOne();
        return true;
    }
}

module.exports = new CategoryService();
