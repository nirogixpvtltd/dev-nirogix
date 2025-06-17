const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/availability', doctorController.getDoctorAvailability);

// Protected routes - Doctor only
router.post('/', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.createDoctor);
router.put('/:id', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.updateDoctor);
router.put('/:id/availability', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.updateAvailability);
router.get('/:id/appointments', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.getDoctorAppointments);
router.put('/:id/appointments/:appointmentId', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.updateAppointmentStatus);
router.get('/:id/dashboard', authMiddleware.authenticate, authMiddleware.checkRole('doctor'), doctorController.getDoctorDashboard);

module.exports = router; 