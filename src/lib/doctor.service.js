import axios from 'axios';
import { API_URL, ENDPOINTS } from './config';

class DoctorService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async register(doctorData) {
        try {
            const response = await this.api.post(ENDPOINTS.DOCTORS.REGISTER, doctorData);
            return response.data;
        } catch (error) {
            console.error('Doctor registration error:', error);
            throw this.handleError(error);
        }
    }

    async getDoctors(params = {}) {
        try {
            const response = await this.api.get(ENDPOINTS.DOCTORS.LIST, { params });
            return response.data;
        } catch (error) {
            console.error('Get doctors error:', error);
            throw this.handleError(error);
        }
    }

    async getDoctorById(id) {
        try {
            const response = await this.api.get(`${ENDPOINTS.DOCTORS.GET}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get doctor error:', error);
            throw this.handleError(error);
        }
    }

    async updateDoctorProfile(id, doctorData) {
        try {
            const response = await this.api.put(`${ENDPOINTS.DOCTORS.UPDATE}/${id}`, doctorData);
            return response.data;
        } catch (error) {
            console.error('Update doctor profile error:', error);
            throw this.handleError(error);
        }
    }

    async getDoctorAvailability(id, date) {
        try {
            const response = await this.api.get(`${ENDPOINTS.DOCTORS.AVAILABILITY}/${id}`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            console.error('Get doctor availability error:', error);
            throw this.handleError(error);
        }
    }

    async updateDoctorAvailability(id, availabilityData) {
        try {
            const response = await this.api.put(`${ENDPOINTS.DOCTORS.AVAILABILITY}/${id}`, availabilityData);
            return response.data;
        } catch (error) {
            console.error('Update doctor availability error:', error);
            throw this.handleError(error);
        }
    }

    async getDoctorAppointments(id, params = {}) {
        try {
            const response = await this.api.get(`${ENDPOINTS.DOCTORS.APPOINTMENTS}/${id}`, { params });
            return response.data;
        } catch (error) {
            console.error('Get doctor appointments error:', error);
            throw this.handleError(error);
        }
    }

    async updateAppointmentStatus(id, appointmentId, status) {
        try {
            const response = await this.api.put(`${ENDPOINTS.DOCTORS.APPOINTMENT_STATUS}/${id}/${appointmentId}`, { status });
            return response.data;
        } catch (error) {
            console.error('Update appointment status error:', error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const message = error.response.data?.message || 'An error occurred';
            return new Error(message);
        } else if (error.request) {
            // The request was made but no response was received
            return new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            return error;
        }
    }
}

export const doctorService = new DoctorService(); 