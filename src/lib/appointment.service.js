import axios from 'axios';
import { API_URL, ENDPOINTS } from './config';

class AppointmentService {
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

    async bookAppointment(appointmentData) {
        try {
            const response = await this.api.post(ENDPOINTS.APPOINTMENTS.BOOK, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Book appointment error:', error);
            throw this.handleError(error);
        }
    }

    async getAppointments(params = {}) {
        try {
            const response = await this.api.get(ENDPOINTS.APPOINTMENTS.LIST, { params });
            return response.data;
        } catch (error) {
            console.error('Get appointments error:', error);
            throw this.handleError(error);
        }
    }

    async getAppointmentById(id) {
        try {
            const response = await this.api.get(`${ENDPOINTS.APPOINTMENTS.GET}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Get appointment error:', error);
            throw this.handleError(error);
        }
    }

    async updateAppointment(id, appointmentData) {
        try {
            const response = await this.api.put(`${ENDPOINTS.APPOINTMENTS.UPDATE}/${id}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Update appointment error:', error);
            throw this.handleError(error);
        }
    }

    async cancelAppointment(id) {
        try {
            const response = await this.api.put(`${ENDPOINTS.APPOINTMENTS.CANCEL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Cancel appointment error:', error);
            throw this.handleError(error);
        }
    }

    async rescheduleAppointment(id, newDateTime) {
        try {
            const response = await this.api.put(`${ENDPOINTS.APPOINTMENTS.RESCHEDULE}/${id}`, { newDateTime });
            return response.data;
        } catch (error) {
            console.error('Reschedule appointment error:', error);
            throw this.handleError(error);
        }
    }

    async getUpcomingAppointments() {
        try {
            const response = await this.api.get(ENDPOINTS.APPOINTMENTS.UPCOMING);
            return response.data;
        } catch (error) {
            console.error('Get upcoming appointments error:', error);
            throw this.handleError(error);
        }
    }

    async getPastAppointments() {
        try {
            const response = await this.api.get(ENDPOINTS.APPOINTMENTS.PAST);
            return response.data;
        } catch (error) {
            console.error('Get past appointments error:', error);
            throw this.handleError(error);
        }
    }

    async addAppointmentNote(id, note) {
        try {
            const response = await this.api.post(`${ENDPOINTS.APPOINTMENTS.NOTES}/${id}`, { note });
            return response.data;
        } catch (error) {
            console.error('Add appointment note error:', error);
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

export const appointmentService = new AppointmentService(); 