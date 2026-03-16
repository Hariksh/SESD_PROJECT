const BaseController = require('../core/base.controller');
const inventoryService = require('../services/inventory.service');

class ProductController extends BaseController {
    async getAllProducts(req, res) {
        try {
            const products = await inventoryService.getAllProducts();
            return this.sendSuccess(res, products);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    async createProduct(req, res) {
        try {
            if (req.body.role !== 'ADMIN') {
                return this.sendError(res, 'Forbidden: Admin access only', 403);
            }
            const product = await inventoryService.createProduct(req.body);
            return this.sendSuccess(res, product, 'Product created successfully', 201);
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async updateStock(req, res) {
        const { quantity, version, role } = req.body;
        try {
            if (role !== 'STAFF' && role !== 'ADMIN') {
                 return this.sendError(res, 'Forbidden: Staff or Admin access only', 403);
            }
            const updatedProduct = await inventoryService.updateStockAtomic(req.params.id, quantity, version);
            return this.sendSuccess(res, updatedProduct, 'Stock updated successfully');
        } catch (error) {
            if (error.message.includes('Conflict')) {
                return this.sendError(res, error.message, 409);
            }
            return this.sendError(res, error.message, 400);
        }
    }
}

module.exports = new ProductController();
