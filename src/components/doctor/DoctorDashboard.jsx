import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doctorService } from '@/lib/doctor.service';
import { authService } from '@/lib/auth.service';
import {
    Calendar,
    Clock,
    DollarSign,
    User,
    Settings,
    LogOut,
    Users,
    Star,
    Video
} from 'lucide-react';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    navigate('/login');
                    return;
                }

                const data = await doctorService.getDoctorDashboard(currentUser.id);
                setDashboardData(data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
                        <p className="text-gray-600">Welcome back, Dr. {dashboardData?.name}</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => navigate('/doctor/settings')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardData?.todayAppointments || 0}</h3>
                                </div>
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardData?.totalPatients || 0}</h3>
                                </div>
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardData?.averageRating || 0}</h3>
                                </div>
                                <Star className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                                    <h3 className="text-2xl font-bold mt-1">${dashboardData?.monthlyEarnings || 0}</h3>
                                </div>
                                <DollarSign className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="appointments" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                        <TabsTrigger value="patients">Patients</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                        <TabsTrigger value="availability">Availability</TabsTrigger>
                    </TabsList>

                    <TabsContent value="appointments">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                                <CardDescription>Manage your upcoming consultations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dashboardData?.upcomingAppointments?.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashboardData.upcomingAppointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <User className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{appointment.patientName}</h4>
                                                        <p className="text-sm text-gray-600">{appointment.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <p className="font-medium">{appointment.date}</p>
                                                        <p className="text-sm text-gray-600">{appointment.time}</p>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        <Video className="h-4 w-4 mr-2" />
                                                        Join
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600 py-4">No upcoming appointments</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="patients">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Patients</CardTitle>
                                <CardDescription>View your recent patient interactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dashboardData?.recentPatients?.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashboardData.recentPatients.map((patient) => (
                                            <div
                                                key={patient.id}
                                                className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-2 bg-primary/10 rounded-full">
                                                        <User className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{patient.name}</h4>
                                                        <p className="text-sm text-gray-600">Last visit: {patient.lastVisit}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View History
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-600 py-4">No recent patients</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="earnings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings Overview</CardTitle>
                                <CardDescription>Track your consultation earnings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Add earnings chart or detailed breakdown here */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-white rounded-lg border">
                                            <p className="text-sm text-gray-600">Today</p>
                                            <p className="text-xl font-bold">${dashboardData?.todayEarnings || 0}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg border">
                                            <p className="text-sm text-gray-600">This Week</p>
                                            <p className="text-xl font-bold">${dashboardData?.weeklyEarnings || 0}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-lg border">
                                            <p className="text-sm text-gray-600">This Month</p>
                                            <p className="text-xl font-bold">${dashboardData?.monthlyEarnings || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="availability">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Availability</CardTitle>
                                <CardDescription>Set your consultation hours</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => navigate('/doctor/availability')}>
                                    Update Availability
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DoctorDashboard; 