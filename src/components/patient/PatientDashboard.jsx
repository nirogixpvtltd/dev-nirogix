import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
  Calendar, Clock, Video, FileText, Plus, Search,
  Heart, User, Bell, Settings, LogOut,
  Download, MessageCircle, Phone, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { appointmentService } from '@/lib/appointment.service';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user._id) {
          console.error('No user found in context:', user);
          toast({
            title: "Error",
            description: "Please log in to view your dashboard",
            variant: "destructive"
          });
          window.location.href = '/';
          return;
        }

        console.log('Fetching appointments for user:', user._id);
        const appointmentsData = await appointmentService.getPatientAppointments();
        console.log('Received appointments:', appointmentsData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.date) >= new Date() && apt.status === 'confirmed'
  );

  const pastAppointments = appointments.filter(apt =>
    new Date(apt.date) < new Date() || apt.status === 'completed'
  );

  const handleJoinConsultation = (appointmentId) => {
    window.location.href = `/consultation/${appointmentId}`;
  };

  const handleViewPrescription = (appointmentId) => {
    window.location.href = `/prescription/${appointmentId}`;
  };

  const handleBookNew = () => {
    window.location.href = '/search';
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAppointmentStatus = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();

    if (appointmentDate > now && appointment.status === 'confirmed') {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-700' };
    } else if (appointment.status === 'completed') {
      return { status: 'completed', color: 'bg-green-100 text-green-700' };
    } else if (appointment.status === 'cancelled') {
      return { status: 'cancelled', color: 'bg-red-100 text-red-700' };
    } else {
      return { status: 'pending', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Patient'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-blue-300 text-blue-600">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-red-300 text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="glass-effect border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pastAppointments.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pastAppointments.length}</p>
                  <p className="text-sm text-gray-600">Prescriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>Upcoming Appointments</span>
                    </CardTitle>
                    <CardDescription>Your scheduled consultations</CardDescription>
                  </div>
                  <Button onClick={handleBookNew} className="medical-gradient text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Book New
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
                      <p className="text-gray-600 mb-4">Book your first consultation with our expert doctors</p>
                      <Button onClick={handleBookNew} className="medical-gradient text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Find Doctors
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => {
                        const statusInfo = getAppointmentStatus(appointment);
                        return (
                          <div key={appointment._id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12 border-2 border-blue-200">
                                  <AvatarImage src={appointment.doctor?.avatar} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {appointment.doctor?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{appointment.doctor?.name}</h4>
                                  <p className="text-sm text-gray-600">{appointment.doctor?.specialty}</p>
                                </div>
                              </div>
                              <Badge className={statusInfo.color}>
                                {statusInfo.status}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{new Date(appointment.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{appointment.timeSlot}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleJoinConsultation(appointment._id)}
                                className="medical-gradient text-white"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-300 text-blue-600"
                                onClick={() => toast({
                                  title: "🚧 Feature Coming Soon!",
                                  description: "Messaging will be available soon! 🚀"
                                })}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Past Consultations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <span>Past Consultations</span>
                  </CardTitle>
                  <CardDescription>Your consultation history</CardDescription>
                </CardHeader>
                <CardContent>
                  {pastAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Consultations</h3>
                      <p className="text-gray-600">Your consultation history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <div key={appointment._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 border-2 border-gray-200">
                                <AvatarImage src={appointment.doctor?.avatar} />
                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                  {appointment.doctor?.name?.split(' ').map(n => n[0]).join('') || 'DR'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold text-gray-900">{appointment.doctor?.name}</h4>
                                <p className="text-sm text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Completed</Badge>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPrescription(appointment._id)}
                              className="border-blue-300 text-blue-600"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Prescription
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-600"
                              onClick={() => toast({
                                title: "🚧 Feature Coming Soon!",
                                description: "Download reports will be available soon! 🚀"
                              })}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleBookNew} className="w-full medical-gradient text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Find Doctors
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600"
                    onClick={() => toast({
                      title: "🚧 Feature Coming Soon!",
                      description: "Emergency consultation will be available soon! 🚀"
                    })}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Call
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-blue-300 text-blue-600"
                    onClick={() => toast({
                      title: "🚧 Feature Coming Soon!",
                      description: "Health records will be available soon! 🚀"
                    })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Health Records
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-4 border-blue-200">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {user?.email?.charAt(0).toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-gray-900">{user?.email || 'Patient'}</h3>
                    <p className="text-sm text-gray-600">Member since {new Date().getFullYear()}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-300 text-blue-600"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Health Tip of the Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 text-sm mb-3">
                    Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body function and supports overall health.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-300 text-green-600"
                    onClick={() => toast({
                      title: "🚧 Feature Coming Soon!",
                      description: "Health tips will be available soon! 🚀"
                    })}
                  >
                    More Tips
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
