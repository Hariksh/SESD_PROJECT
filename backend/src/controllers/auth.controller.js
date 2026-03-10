const BaseController = require('../core/base.controller');
const authService = require('../services/auth.service');
const User = require('../models/user.model');

class AuthController extends BaseController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const authData = await authService.authenticate(email, password);
            return this.sendSuccess(res, authData, 'Login successful');
        } catch (error) {
            return this.sendError(res, error.message, 401);
        }
    }

    async register(req, res) {
        const { name, email, password, role } = req.body;

        try {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return this.sendError(res, 'User already exists', 400);
            }

            const user = await User.create({
                name,
                email,
                password,
                role: role || 'STAFF',
            });

            if (user) {
                const userData = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: authService.generateToken(user._id),
                };
                return this.sendSuccess(res, userData, 'User registered successfully', 201);
            }
        } catch (error) {
            return this.sendError(res, error.message, 400);
        }
    }
}

module.exports = new AuthController();
