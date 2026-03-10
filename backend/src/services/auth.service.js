const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const BaseService = require('../core/base.service');

class AuthService extends BaseService {
    async authenticate(email, password) {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: this.generateToken(user._id),
            };
        }
        throw new Error('Invalid email or password');
    }

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return await User.findById(decoded.id).select('-password');
        } catch (error) {
            throw new Error('Not authorized, token failed');
        }
    }
}

module.exports = new AuthService();
