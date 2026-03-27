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

    async getProductById(req, res) {
        try {
            const product = await inventoryService.getProductById(req.params.id);
            if (!product) {
                return this.sendError(res, 'Product not found', 404);
            }
            return this.sendSuccess(res, product);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    async createProduct(req, res) {
        try {
            // RBAC enforced by middleware — req.user is guaranteed to be ADMIN
            const product = await inventoryService.createProduct(req.body);
            return this.sendSuccess(res, product, 'Product created successfully', 201);
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await inventoryService.updateProduct(req.params.id, req.body);
            return this.sendSuccess(res, product, 'Product updated successfully');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async deleteProduct(req, res) {
        try {
            await inventoryService.deleteProduct(req.params.id);
            return this.sendSuccess(res, null, 'Product deleted successfully');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    async updateStock(req, res) {
        const { quantity, version } = req.body;
        try {
            // RBAC enforced by middleware — req.user is guaranteed to be STAFF or ADMIN
            const updatedProduct = await inventoryService.updateStockAtomic(req.params.id, quantity, version);
            return this.sendSuccess(res, updatedProduct, 'Stock updated successfully');
        } catch (error) {
            if (error.message.includes('Conflict')) {
                return this.sendError(res, error.message, 409);
            }
            return this.sendError(res, error.message, 400);
        }
    }

    async getStockLogs(req, res) {
        try {
            const logs = await inventoryService.getStockLogs(req.params.id);
            return this.sendSuccess(res, logs);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }
}

module.exports = new ProductController();
