
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, Clock, Plus, Edit, Trash2, Save, 
  BarChart3, Users, DollarSign, Heart, Settings
} from 'lucide-react';

const DoctorAvailability = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    // Get doctor profile
    const profile = JSON.parse(localStorage.getItem('doctorProfile') || '{}');
    setDoctorProfile(profile);

    // Load existing time slots
    const savedSlots = JSON.parse(localStorage.getItem('doctorAvailability') || '[]');
    setTimeSlots(savedSlots);
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end times",
        variant: "destructive"
      });
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    const slot = {
      id: Date.now(),
      date: selectedDate,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      status: 'available'
    };

    const updatedSlots = [...timeSlots, slot];
    setTimeSlots(updatedSlots);
    localStorage.setItem('doctorAvailability', JSON.stringify(updatedSlots));

    setNewSlot({ startTime: '', endTime: '' });
    setIsAddingSlot(false);

    toast({
      title: "Time Slot Added",
      description: "Your availability has been updated"
    });
  };

  const handleDeleteSlot = (slotId) => {
    const updatedSlots = timeSlots.filter(slot => slot.id !== slotId);
    setTimeSlots(updatedSlots);
    localStorage.setItem('doctorAvailability', JSON.stringify(updatedSlots));

    toast({
      title: "Time Slot Removed",
      description: "Your availability has been updated"
    });
  };

  const getSlotsForDate = (date) => {
    return timeSlots.filter(slot => slot.date === date);
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateToEarnings = () => {
    navigate('/doctor-earnings');
  };

  const navigateToConsultation = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Active consultations will be available soon! 🚀"
    });
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {doctorProfile?.fullName || 'Doctor'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={navigateToEarnings} className="border-blue-300 text-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Earnings
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-effect border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getSlotsForDate(selectedDate).length}</p>
                  <p className="text-sm text-gray-600">Today's Slots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Consultations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${doctorProfile?.consultationFee || 150}</p>
                  <p className="text-sm text-gray-600">Per Session</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Availability Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>Weekly Availability</span>
                  </CardTitle>
                  <CardDescription>Manage your consultation schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {weekDates.map((date, index) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const daySlots = getSlotsForDate(dateStr);
                      const isSelected = dateStr === selectedDate;
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      
                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            isSelected 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : isToday
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xs font-medium">
                            {date.toLocaleDateString('en', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-bold">
                            {date.getDate()}
                          </div>
                          <div className="text-xs">
                            {daySlots.length} slots
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date Slots */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {new Date(selectedDate).toLocaleDateString('en', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <Button 
                        onClick={() => setIsAddingSlot(true)}
                        size="sm"
                        className="medical-gradient text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>

                    {/* Add New Slot Form */}
                    {isAddingSlot && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-3">Add New Time Slot</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</label>
                            <select
                              value={newSlot.startTime}
                              onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option value="">Select start time</option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">End Time</label>
                            <select
                              value={newSlot.endTime}
                              onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option value="">Select end time</option>
                              {timeOptions.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddSlot} size="sm" className="medical-gradient text-white">
                            <Save className="h-4 w-4 mr-2" />
                            Save Slot
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsAddingSlot(false);
                              setNewSlot({ startTime: '', endTime: '' });
                            }}
                            variant="outline" 
                            size="sm"
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Existing Slots */}
                    <div className="space-y-2">
                      {getSlotsForDate(selectedDate).length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Time Slots</h3>
                          <p className="text-gray-600">Add your first time slot for this date</p>
                        </div>
                      ) : (
                        getSlotsForDate(selectedDate).map((slot) => (
                          <div key={slot.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={slot.status === 'available' ? 'border-green-300 text-green-600' : 'border-red-300 text-red-600'}
                              >
                                {slot.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="icon" 
                                variant="outline"
                                className="h-8 w-8 border-blue-300 text-blue-600"
                                onClick={() => toast({
                                  title: "🚧 Feature Coming Soon!",
                                  description: "Slot editing will be available soon! 🚀"
                                })}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="outline"
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="h-8 w-8 border-red-300 text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
                  <Button onClick={navigateToConsultation} className="w-full medical-gradient text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Active Consultations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-300 text-blue-600"
                    onClick={navigateToEarnings}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Earnings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-300 text-blue-600"
                    onClick={() => toast({
                      title: "🚧 Feature Coming Soon!",
                      description: "Patient management will be available soon! 🚀"
                    })}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Patient History
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
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <img  className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-blue-200" alt="Doctor profile" src="https://images.unsplash.com/photo-1588966915713-6d43603478e5" />
                    <h3 className="font-semibold text-gray-900">{doctorProfile?.fullName || 'Doctor'}</h3>
                    <p className="text-sm text-blue-600 capitalize">{doctorProfile?.specialty || 'Medical Specialist'}</p>
                    <p className="text-xs text-gray-600 mt-1">License: {doctorProfile?.licenseNumber || 'MD123456'}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{doctorProfile?.experience || '5+ years'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Fee:</span>
                      <span className="font-medium">${doctorProfile?.consultationFee || 150}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="outline" className="border-green-300 text-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-blue-300 text-blue-600"
                    onClick={() => toast({
                      title: "🚧 Feature Coming Soon!",
                      description: "Profile editing will be available soon! 🚀"
                    })}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getSlotsForDate(new Date().toISOString().split('T')[0]).slice(0, 3).map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between text-sm">
                        <span className="text-green-700">{slot.startTime} - {slot.endTime}</span>
                        <Badge variant="outline" className="border-green-300 text-green-600">
                          {slot.status}
                        </Badge>
                      </div>
                    ))}
                    {getSlotsForDate(new Date().toISOString().split('T')[0]).length === 0 && (
                      <p className="text-green-700 text-sm">No slots scheduled for today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
