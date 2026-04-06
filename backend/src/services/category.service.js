const Category = require('../models/category.model');
const BaseService = require('../core/base.service');

class CategoryService extends BaseService {
    constructor() {
        super(Category);
    }

    async create(data) {
        const existing = await this.model.findOne({ name: data.name });
        if (existing) {
            throw new Error('Category already exists');
        }
        return super.create(data);
    }
}

module.exports = new CategoryService();
