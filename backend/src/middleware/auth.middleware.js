const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = {
    authenticate: async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (!user.isActive) {
                return res.status(401).json({ message: 'User account is inactive' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    checkRole: (roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Convert single role to array for consistent handling
            const roleArray = Array.isArray(roles) ? roles : [roles];

            if (!roleArray.includes(req.user.role)) {
                return res.status(403).json({
                    message: 'Access denied. Insufficient permissions.'
                });
            }

            next();
        };
    },

    verifyDoctor: async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            if (req.user.role !== 'doctor') {
                return res.status(403).json({ message: 'Access denied. Doctor access required.' });
            }

            if (!req.user.isVerified) {
                return res.status(403).json({ message: 'Doctor account not verified' });
            }

            next();
        } catch (error) {
            console.error('Doctor verification error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    verifyPatient: async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            if (req.user.role !== 'patient') {
                return res.status(403).json({ message: 'Access denied. Patient access required.' });
            }

            next();
        } catch (error) {
            console.error('Patient verification error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authMiddleware; 