const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.put('/profile', authMiddleware.authenticate, authController.updateProfile);
router.put('/change-password', authMiddleware.authenticate, authController.changePassword);

// Admin only routes
router.get('/users',
    authMiddleware.authenticate,
    authMiddleware.checkRole(['admin']),
    authController.getAllUsers
);

router.put('/users/:id/status',
    authMiddleware.authenticate,
    authMiddleware.checkRole(['admin']),
    authController.updateUserStatus
);

module.exports = router; 