const BaseController = require('../core/base.controller');
const userService = require('../services/user.service');

/**
 * UserController — Admin-only user management endpoints.
 * Fulfills idea.md: "Admin: Full access ... user management"
 */
class UserController extends BaseController {
    /**
     * GET /api/users
     * Returns all users (Admin only).
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return this.sendSuccess(res, users, `${users.length} user(s) found`);
        } catch (error) {
            return this.sendError(res, error.message);
        }
    }

    /**
     * GET /api/users/:id
     * Returns a single user by ID (Admin only).
     */
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            return this.sendSuccess(res, user);
        } catch (error) {
            return this.sendError(res, error.message, 404);
        }
    }

    /**
     * PATCH /api/users/:id/role
     * Updates a user's role (Admin only). Body: { role: 'ADMIN' | 'STAFF' }
     */
    async updateUserRole(req, res) {
        try {
            const { role } = req.body;
            if (!['ADMIN', 'STAFF'].includes(role)) {
                return this.sendError(res, 'Invalid role. Must be ADMIN or STAFF.', 400);
            }
            const user = await userService.updateUserRole(req.params.id, role, req.user._id);
            return this.sendSuccess(res, { _id: user._id, name: user.name, email: user.email, role: user.role }, 'User role updated');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }

    /**
     * DELETE /api/users/:id
     * Deletes a user account (Admin only).
     */
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(req.params.id, req.user._id);
            return this.sendSuccess(res, null, 'User deleted successfully');
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }
}

module.exports = new UserController();
