const BaseController = require('../core/base.controller');
const analyticsService = require('../services/analytics.service');

class AnalyticsController extends BaseController {
    async getDashboardData(req, res) {
        try {
            const data = await analyticsService.getDashboardStats();
            return this.sendSuccess(res, data);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }
}

module.exports = new AnalyticsController();
