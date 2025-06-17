const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/:id', appointmentController.getAppointmentDetails);

// Protected routes for patients
router.post('/',
    authMiddleware.authenticate,
    authMiddleware.verifyPatient,
    appointmentController.createAppointment
);

router.get('/patient/appointments',
    authMiddleware.authenticate,
    authMiddleware.verifyPatient,
    appointmentController.getPatientAppointments
);

router.get('/patient/upcoming',
    authMiddleware.authenticate,
    authMiddleware.verifyPatient,
    appointmentController.getUpcomingAppointments
);

router.get('/patient/past',
    authMiddleware.authenticate,
    authMiddleware.verifyPatient,
    appointmentController.getPastAppointments
);

// Protected routes for doctors
router.get('/doctor/appointments',
    authMiddleware.authenticate,
    authMiddleware.verifyDoctor,
    appointmentController.getDoctorAppointments
);

router.get('/doctor/upcoming',
    authMiddleware.authenticate,
    authMiddleware.verifyDoctor,
    appointmentController.getUpcomingAppointments
);

router.get('/doctor/past',
    authMiddleware.authenticate,
    authMiddleware.verifyDoctor,
    appointmentController.getPastAppointments
);

// Common protected routes
router.put('/:id/status',
    authMiddleware.authenticate,
    appointmentController.updateAppointmentStatus
);

router.put('/:id/payment',
    authMiddleware.authenticate,
    appointmentController.updatePaymentStatus
);

router.put('/:id/cancel',
    authMiddleware.authenticate,
    appointmentController.cancelAppointment
);

// Test route to verify route loading
router.get('/test', (req, res) => res.json({ message: 'Test route works' }));

// Health check route
router.get('/health', (req, res) => res.json({ status: 'ok', message: 'Appointments API is healthy' }));

module.exports = router; 