const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../config/email.config');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Generate OTP
            const otp = generateOTP();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

            // Create new user
            const user = new User({
                email,
                password,
                name,
                otp: {
                    code: otp,
                    expiresAt: otpExpiry
                }
            });

            await user.save();

            // Send OTP email
            const emailSent = await sendOTPEmail(email, otp);
            if (!emailSent) {
                return res.status(500).json({ message: 'Error sending OTP email' });
            }

            res.status(201).json({ message: 'Registration successful. Please verify your email with OTP.' });
        } catch (error) {
            res.status(500).json({ message: 'Error in registration', error: error.message });
        }
    },

    // Verify OTP
    verifyOTP: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.otp || user.otp.code !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            if (user.otp.expiresAt < new Date()) {
                return res.status(400).json({ message: 'OTP has expired' });
            }

            user.isVerified = true;
            user.otp = undefined;
            await user.save();

            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error in OTP verification', error: error.message });
        }
    },

    // Login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt for email:', email);

            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found:', email);
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.isVerified) {
                console.log('User not verified:', email);
                return res.status(400).json({ message: 'Please verify your email first' });
            }

            console.log('Comparing password for user:', email);
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                console.log('Invalid password for user:', email);
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            console.log('Login successful for user:', email);

            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role || 'patient'
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error in login', error: error.message });
        }
    },

    // Logout
    logout: async (req, res) => {
        try {
            // In a real application, you might want to blacklist the token
            // For now, we'll just send a success response
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error in logout', error: error.message });
        }
    },

    // Get current user
    getCurrentUser: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password -otp');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    // Update user profile
    updateProfile: async (req, res) => {
        try {
            const { name, email, currentPassword, newPassword } = req.body;
            const user = req.user;

            // If updating email, check if it's already taken
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email is already taken' });
                }
                user.email = email;
            }

            // If updating name
            if (name) {
                user.name = name;
            }

            // If updating password
            if (currentPassword && newPassword) {
                const isMatch = await user.comparePassword(currentPassword);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Current password is incorrect' });
                }
                user.password = newPassword;
            }

            await user.save();

            // Return updated user data (excluding sensitive information)
            res.json({
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error.message });
        }
    },

    // Change password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = req.user;

            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password changed successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error changing password', error: error.message });
        }
    },

    // Forgot password
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const otp = generateOTP();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

            user.otp = {
                code: otp,
                expiresAt: otpExpiry
            };
            await user.save();

            const emailSent = await sendOTPEmail(email, otp);
            if (!emailSent) {
                return res.status(500).json({ message: 'Error sending OTP email' });
            }

            res.json({ message: 'Password reset OTP sent to your email' });
        } catch (error) {
            res.status(500).json({ message: 'Error in forgot password', error: error.message });
        }
    },

    // Reset password
    resetPassword: async (req, res) => {
        try {
            const { email, otp, newPassword } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.otp || user.otp.code !== otp) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            if (user.otp.expiresAt < new Date()) {
                return res.status(400).json({ message: 'OTP has expired' });
            }

            user.password = newPassword;
            user.otp = undefined;
            await user.save();

            res.json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error in reset password', error: error.message });
        }
    },

    // Get all users (admin only)
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password -otp');
            res.json({ users });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    },

    // Update user status (admin only)
    updateUserStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.isActive = isActive;
            await user.save();

            res.json({ message: 'User status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user status', error: error.message });
        }
    }
};

module.exports = authController; 