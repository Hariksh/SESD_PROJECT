const mongoose = require('mongoose');

class CategorySchema {
    static create() {
        const schema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                unique: true,
                trim: true,
            },
            description: {
                type: String,
                default: '',
            },
        }, {
            timestamps: true,
        });

        return schema;
    }
}

const Category = mongoose.model('Category', CategorySchema.create());
module.exports = Category;
