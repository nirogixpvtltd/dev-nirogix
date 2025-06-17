// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth Configuration
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PATIENT_DASHBOARD: '/dashboard',
    DOCTOR_DASHBOARD: '/doctor/dashboard',
    DOCTOR_REGISTER: '/doctor/register',
    APPOINTMENTS: '/appointments',
    PROFILE: '/profile',
    SETTINGS: '/settings'
};

// API Endpoints
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        PROFILE: '/api/auth/profile'
    },
    DOCTORS: {
        LIST: '/api/doctors',
        REGISTER: '/api/doctors/register',
        PROFILE: '/api/doctors/profile',
        AVAILABILITY: '/api/doctors/availability',
        DASHBOARD: '/api/doctors/dashboard'
    },
    APPOINTMENTS: {
        LIST: '/api/appointments',
        CREATE: '/api/appointments',
        UPDATE: '/api/appointments',
        CANCEL: '/api/appointments/cancel'
    }
};

// Other configuration constants can be added here
export const APP_CONFIG = {
    APP_NAME: 'Nirogix',
    VERSION: '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development'
}; 