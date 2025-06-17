const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const { validateObjectId } = require('../utils/validation');

const appointmentController = {
    // Create a new appointment
    createAppointment: async (req, res) => {
        try {
            const { doctorId, date, timeSlot, symptoms, medicalHistory } = req.body;
            const patientId = req.user._id;

            // Only log non-sensitive info
            console.log('Creating appointment for patient ID:', patientId, 'with doctor ID:', doctorId);

            if (!validateObjectId(doctorId)) {
                return res.status(400).json({ message: 'Invalid doctor ID' });
            }

            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            const patient = await User.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const appointment = new Appointment({
                doctor: doctorId,
                patient: patientId,
                date,
                timeSlot,
                symptoms,
                medicalHistory,
                status: 'pending',
                paymentStatus: 'pending'
            });

            await appointment.save();
            res.status(201).json({
                message: 'Appointment created successfully',
                appointment
            });
        } catch (error) {
            console.error('Error creating appointment:', error.message);
            res.status(500).json({
                message: 'Error creating appointment',
                error: 'Internal server error'
            });
        }
    },

    // Get patient's appointments
    getPatientAppointments: async (req, res) => {
        try {
            // Only log non-sensitive info
            console.log('Getting appointments for patient ID:', req.user?._id);
            const patientId = req.user._id;

            if (!req.user || !req.user._id) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const appointments = await Appointment.find({ patient: patientId })
                .populate('doctor', 'name specialty')
                .sort({ date: -1 });

            res.json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error.message);
            res.status(500).json({
                message: 'Error fetching appointments',
                error: 'Internal server error'
            });
        }
    },

    // Get doctor's appointments
    getDoctorAppointments: async (req, res) => {
        try {
            const doctorId = req.user._id;
            console.log('Getting appointments for doctor ID:', doctorId);

            const appointments = await Appointment.find({ doctor: doctorId })
                .populate('patient', 'name email')
                .sort({ date: -1 });

            res.json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error.message);
            res.status(500).json({
                message: 'Error fetching appointments',
                error: 'Internal server error'
            });
        }
    },

    // Get appointment details
    getAppointmentDetails: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            console.log('Getting details for appointment ID:', appointmentId);

            if (!validateObjectId(appointmentId)) {
                return res.status(400).json({ message: 'Invalid appointment ID' });
            }

            const appointment = await Appointment.findById(appointmentId)
                .populate('doctor', 'name specialty')
                .populate('patient', 'name email');

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            res.json(appointment);
        } catch (error) {
            console.error('Error fetching appointment details:', error.message);
            res.status(500).json({
                message: 'Error fetching appointment details',
                error: 'Internal server error'
            });
        }
    },

    // Update appointment status
    updateAppointmentStatus: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const { status } = req.body;
            console.log('Updating appointment status for appointment ID:', appointmentId);

            if (!validateObjectId(appointmentId)) {
                return res.status(400).json({ message: 'Invalid appointment ID' });
            }

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            appointment.status = status;
            await appointment.save();

            res.json({
                message: 'Appointment status updated successfully',
                appointment
            });
        } catch (error) {
            console.error('Error updating appointment:', error.message);
            res.status(500).json({
                message: 'Error updating appointment',
                error: 'Internal server error'
            });
        }
    },

    // Update payment status
    updatePaymentStatus: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const { paymentStatus } = req.body;
            console.log('Updating payment status for appointment ID:', appointmentId);

            if (!validateObjectId(appointmentId)) {
                return res.status(400).json({ message: 'Invalid appointment ID' });
            }

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            appointment.paymentStatus = paymentStatus;
            await appointment.save();

            res.json({
                message: 'Payment status updated successfully',
                appointment
            });
        } catch (error) {
            console.error('Error updating payment status:', error.message);
            res.status(500).json({
                message: 'Error updating payment status',
                error: 'Internal server error'
            });
        }
    },

    // Get upcoming appointments
    getUpcomingAppointments: async (req, res) => {
        try {
            const userId = req.user._id;
            const userRole = req.user.role;

            const query = userRole === 'doctor'
                ? { doctor: userId, date: { $gte: new Date() } }
                : { patient: userId, date: { $gte: new Date() } };

            const appointments = await Appointment.find(query)
                .populate(userRole === 'doctor' ? 'patient' : 'doctor', 'name email')
                .sort({ date: 1 });

            res.json(appointments);
        } catch (error) {
            console.error('Error fetching upcoming appointments:', error.message);
            res.status(500).json({
                message: 'Error fetching upcoming appointments',
                error: 'Internal server error'
            });
        }
    },

    // Get past appointments
    getPastAppointments: async (req, res) => {
        try {
            const userId = req.user._id;
            const userRole = req.user.role;

            const query = userRole === 'doctor'
                ? { doctor: userId, date: { $lt: new Date() } }
                : { patient: userId, date: { $lt: new Date() } };

            const appointments = await Appointment.find(query)
                .populate(userRole === 'doctor' ? 'patient' : 'doctor', 'name email')
                .sort({ date: -1 });

            res.json(appointments);
        } catch (error) {
            console.error('Error fetching past appointments:', error.message);
            res.status(500).json({
                message: 'Error fetching past appointments',
                error: 'Internal server error'
            });
        }
    },

    // Cancel appointment
    cancelAppointment: async (req, res) => {
        try {
            const { appointmentId } = req.params;
            const userId = req.user._id;

            if (!validateObjectId(appointmentId)) {
                return res.status(400).json({ message: 'Invalid appointment ID' });
            }

            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            // Check if user is authorized to cancel
            if (appointment.patient.toString() !== userId.toString() &&
                appointment.doctor.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
            }

            appointment.status = 'cancelled';
            await appointment.save();

            res.json({
                message: 'Appointment cancelled successfully',
                appointment
            });
        } catch (error) {
            console.error('Error cancelling appointment:', error.message);
            res.status(500).json({
                message: 'Error cancelling appointment',
                error: 'Internal server error'
            });
        }
    }
};

module.exports = appointmentController; 