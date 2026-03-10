const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const User = require('../models/user.model');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const authData = await authService.authenticate(email, password);
        res.json(authData);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (In a real app, this might be restricted to Admin)
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'STAFF',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: authService.generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
