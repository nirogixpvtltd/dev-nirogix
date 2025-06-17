const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');
const Appointment = require('../models/appointment.model');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const doctorController = {
    // Get all doctors
    getAllDoctors: async (req, res) => {
        try {
            const doctors = await Doctor.find({}).populate('userId', 'name email');
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(500).json({ message: 'Server error while fetching doctors.' });
        }
    },

    // Get a single doctor by ID
    getDoctorById: async (req, res) => {
        try {
            const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }
            res.status(200).json(doctor);
        } catch (error) {
            console.error('Error fetching doctor by ID:', error);
            res.status(500).json({ message: 'Server error while fetching doctor.' });
        }
    },

    // Get available time slots for a doctor
    getDoctorAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { date } = req.query;

            const doctor = await Doctor.findById(id);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }

            const selectedDate = new Date(date);
            const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });

            const availableSlots = doctor.availability.filter(slot => slot.dayOfWeek === dayOfWeek);

            if (availableSlots.length === 0) {
                return res.status(200).json([]);
            }

            const generatedSlots = [];
            availableSlots.forEach(slot => {
                let [startHour, startMinute] = slot.startTime.split(':').map(Number);
                let [endHour, endMinute] = slot.endTime.split(':').map(Number);

                let currentHour = startHour;
                let currentMinute = startMinute;

                while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
                    const slotTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
                    generatedSlots.push(slotTime);

                    currentMinute += 30;
                    if (currentMinute >= 60) {
                        currentHour += 1;
                        currentMinute -= 60;
                    }
                }
            });

            res.status(200).json(generatedSlots);
        } catch (error) {
            console.error('Error fetching doctor availability:', error);
            res.status(500).json({ message: 'Server error while fetching availability.' });
        }
    },

    // Create a new doctor
    createDoctor: async (req, res) => {
        try {
            const { userId, specialization, experience, bio, contact, availability } = req.body;

            const existingDoctor = await Doctor.findOne({ userId });
            if (existingDoctor) {
                return res.status(400).json({ message: 'Doctor profile already exists for this user.' });
            }

            const user = await User.findById(userId);
            if (!user || user.role !== 'doctor') {
                return res.status(400).json({ message: 'User not found or does not have doctor role.' });
            }

            const newDoctor = new Doctor({
                userId,
                specialization,
                experience,
                bio,
                contact,
                availability
            });

            await newDoctor.save();
            res.status(201).json({ message: 'Doctor profile created successfully', doctor: newDoctor });
        } catch (error) {
            console.error('Error creating doctor profile:', error);
            res.status(500).json({ message: 'Server error while creating doctor profile.' });
        }
    },

    // Update doctor profile
    updateDoctor: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            const doctor = await Doctor.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }

            res.status(200).json({ message: 'Doctor profile updated successfully', doctor });
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            res.status(500).json({ message: 'Server error while updating doctor profile.' });
        }
    },

    // Update doctor availability
    updateAvailability: async (req, res) => {
        try {
            const { id } = req.params;
            const { availability } = req.body;

            const doctor = await Doctor.findByIdAndUpdate(
                id,
                { availability },
                { new: true, runValidators: true }
            );

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }

            res.status(200).json({ message: 'Availability updated successfully', doctor });
        } catch (error) {
            console.error('Error updating availability:', error);
            res.status(500).json({ message: 'Server error while updating availability.' });
        }
    },

    // Get doctor appointments
    getDoctorAppointments: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, date } = req.query;

            const query = { doctor: id };
            if (status) query.status = status;
            if (date) {
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);
                query.date = { $gte: startDate, $lte: endDate };
            }

            const appointments = await Appointment.find(query)
                .populate('patient', 'name email')
                .sort({ date: 1 });

            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            res.status(500).json({ message: 'Server error while fetching appointments.' });
        }
    },

    // Update appointment status
    updateAppointmentStatus: async (req, res) => {
        try {
            const { id, appointmentId } = req.params;
            const { status } = req.body;

            const appointment = await Appointment.findOneAndUpdate(
                { _id: appointmentId, doctor: id },
                { status },
                { new: true }
            );

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found.' });
            }

            res.status(200).json({ message: 'Appointment status updated successfully', appointment });
        } catch (error) {
            console.error('Error updating appointment status:', error);
            res.status(500).json({ message: 'Server error while updating appointment status.' });
        }
    },

    // Get doctor dashboard
    getDoctorDashboard: async (req, res) => {
        try {
            const { id } = req.params;

            const doctor = await Doctor.findById(id).populate('userId', 'name email');
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found.' });
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayAppointments = await Appointment.find({
                doctor: id,
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            }).populate('patient', 'name');

            const totalPatients = await Appointment.distinct('patient', { doctor: id });

            const ratings = await Appointment.find({
                doctor: id,
                rating: { $exists: true }
            });
            const averageRating = ratings.length > 0
                ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
                : 0;

            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const monthlyEarnings = await Appointment.aggregate([
                {
                    $match: {
                        doctor: mongoose.Types.ObjectId(id),
                        date: { $gte: startOfMonth },
                        paymentStatus: 'completed'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' }
                    }
                }
            ]);

            res.status(200).json({
                doctor,
                todayAppointments,
                totalPatients: totalPatients.length,
                averageRating,
                monthlyEarnings: monthlyEarnings[0]?.total || 0
            });
        } catch (error) {
            console.error('Error fetching doctor dashboard:', error);
            res.status(500).json({ message: 'Server error while fetching dashboard data.' });
        }
    }
};

module.exports = doctorController; 