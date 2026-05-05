const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, zone, role, firebaseUid } = req.body;

        // Check for required environment variables
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing from environment variables');
            return res.status(500).json({ message: 'Server configuration error: missing secret' });
        }

        // Check if user already exists by email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = new User({
            name,
            email,
            password,
            phone,
            zone,
            role: role || 'citizen',
            firebaseUid
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err.message);
                    return res.status(500).json({ message: 'Error generating authentication token' });
                }
                const userObj = user.toObject();
                delete userObj.password;
                userObj.id = userObj._id;
                res.json({ token, user: userObj });
            }
        );
    } catch (err) {
        console.error('Signup Error:', err);
        
        // Handle MongoDB Duplicate Key Errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ 
                message: `User with this ${field} already exists` 
            });
        }

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error: ' + messages.join(', ') });
        }
        
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for required environment variables
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is missing from environment variables');
            return res.status(500).json({ message: 'Server configuration error: missing secret' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Create JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err.message);
                    return res.status(500).json({ message: 'Error generating authentication token' });
                }
                const userObj = user.toObject();
                delete userObj.password;
                userObj.id = userObj._id;
                res.json({ token, user: userObj });
            }
        );
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (Admin check simplified for now)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error('Fetch Users Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userObj = user.toObject();
        userObj.id = userObj._id;
        res.json(userObj);
    } catch (err) {
        console.error('Get Profile Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone, zone } = req.body;
        const userId = req.user.id;

        // Build profile object
        const profileFields = {};
        if (name) profileFields.name = name;
        if (phone) profileFields.phone = phone;
        if (zone) profileFields.zone = zone;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            userId,
            { $set: profileFields },
            { new: true }
        ).select('-password');

        const userObj = user.toObject();
        delete userObj.password;
        userObj.id = userObj._id;
        res.json(userObj);
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change Password Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
