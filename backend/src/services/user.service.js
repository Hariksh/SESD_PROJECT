const User = require('../models/user.model');
const BaseService = require('../core/base.service');

/**
 * UserService — Admin user management (idea.md: "Admin: user management")
 * Provides listing, fetching, updating role, and deleting users.
 */
class UserService extends BaseService {
    constructor() {
        super(User);
    }

    /**
     * Returns all users (excluding passwords) — Admin only.
     */
    async getAllUsers() {
        return await this.model.find({}).select('-password').sort({ createdAt: -1 });
    }

    /**
     * Returns a single user by ID (excluding password).
     */
    async getUserById(id) {
        const user = await this.model.findById(id).select('-password');
        if (!user) throw new Error('User not found');
        return user;
    }

    /**
     * Updates a user's role — Admin only.
     * Prevents admins from accidentally removing their own admin role.
     */
    async updateUserRole(id, newRole, requestingUserId) {
        if (id.toString() === requestingUserId.toString()) {
            throw new Error('Admins cannot change their own role.');
        }
        const user = await this.model.findById(id);
        if (!user) throw new Error('User not found');
        user.role = newRole;
        return await user.save();
    }

    /**
     * Deletes a user — Admin only.
     * Prevents self-deletion.
     */
    async deleteUser(id, requestingUserId) {
        if (id.toString() === requestingUserId.toString()) {
            throw new Error('Admins cannot delete their own account.');
        }
        return await this.delete(id);
    }
}

module.exports = new UserService();
