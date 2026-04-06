class BaseService {
    constructor(model) {
        this.model = model;
    }

    async getAll() {
        return await this.model.find({});
    }

    async getById(id) {
        return await this.model.findById(id);
    }

    async create(data) {
        const item = new this.model(data);
        return await item.save();
    }

    async update(id, data) {
        const item = await this.model.findById(id);
        if (!item) {
            throw new Error(`${this.model.modelName} not found`);
        }
        Object.assign(item, data);
        return await item.save();
    }

    async delete(id) {
        const item = await this.model.findById(id);
        if (!item) {
            throw new Error(`${this.model.modelName} not found`);
        }
        await item.deleteOne();
        return true;
    }
}

module.exports = BaseService;
