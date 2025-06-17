import axios from 'axios';
import { API_URL, AUTH_TOKEN_KEY, USER_KEY, ENDPOINTS } from './config';

class AuthService {
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
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle common errors
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    async register(userData) {
        try {
            const response = await this.api.post(ENDPOINTS.AUTH.REGISTER, userData);
            this.setToken(response.data.token);
            this.setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw this.handleError(error);
        }
    }

    async verifyOTP(email, otp) {
        try {
            const response = await this.api.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
            return response.data;
        } catch (error) {
            console.error('OTP verification error:', error);
            throw this.handleError(error);
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
            this.setToken(response.data.token);
            this.setUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw this.handleError(error);
        }
    }

    async logout() {
        try {
            await this.api.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    }

    async getCurrentUser() {
        try {
            const token = this.getToken();
            if (!token) return null;

            const response = await this.api.get(ENDPOINTS.AUTH.PROFILE);
            this.setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error);
            this.clearAuth();
            return null;
        }
    }

    async updateProfile(userData) {
        try {
            const response = await this.api.put(ENDPOINTS.AUTH.PROFILE, userData);
            this.setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw this.handleError(error);
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            const response = await this.api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
            return response.data;
        } catch (error) {
            console.error('Password change error:', error);
            throw this.handleError(error);
        }
    }

    // Helper methods
    setToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    clearAuth() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    isAuthenticated() {
        return !!this.getToken();
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

export const authService = new AuthService(); 