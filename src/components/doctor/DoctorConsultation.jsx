
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Video, VideoOff, Mic, MicOff, Phone, MessageCircle, 
  FileText, User, Clock, Pill, Save, Send, PhoneOff,
  Camera, Monitor, Volume2, VolumeX, Maximize
} from 'lucide-react';

const DoctorConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [consultationTime, setConsultationTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', instructions: '' }],
    instructions: '',
    followUp: ''
  });
  const [showPrescription, setShowPrescription] = useState(false);

  useEffect(() => {
    // Mock appointment data
    const mockAppointment = {
      id: id,
      patientName: "John Doe",
      age: 35,
      symptoms: "Chest pain and shortness of breath",
      medicalHistory: "Hypertension, family history of heart disease",
      startTime: new Date(),
      duration: 30
    };
    setAppointment(mockAppointment);

    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Patient Connected!",
        description: "You are now connected with your patient"
      });
    }, 2000);

    // Start consultation timer
    const timer = setInterval(() => {
      setConsultationTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(timer);
    };
  }, [id]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'doctor',
      message: chatMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate patient response
    setTimeout(() => {
      const patientResponse = {
        id: Date.now() + 1,
        sender: 'patient',
        message: "Thank you, doctor. I understand.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, patientResponse]);
    }, 2000);
  };

  const handleEndCall = () => {
    setShowPrescription(true);
  };

  const handleSavePrescription = () => {
    // Save prescription data
    const prescriptionData = {
      consultationId: id,
      patientName: appointment.patientName,
      ...prescription,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`prescription_${id}`, JSON.stringify(prescriptionData));

    toast({
      title: "Prescription Saved!",
      description: "The prescription has been sent to the patient"
    });

    navigate('/doctor-availability');
  };

  const addMedication = () => {
    setPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', instructions: '' }]
    }));
  };

  const updateMedication = (index, field, value) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedication = (index) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Camera Off" : "Camera On",
      description: `Your camera is now ${isVideoOn ? 'disabled' : 'enabled'}`
    });
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microphone Off" : "Microphone On",
      description: `Your microphone is now ${isAudioOn ? 'disabled' : 'enabled'}`
    });
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showPrescription) {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prescription</h1>
            <p className="text-gray-600">Patient: {appointment.patientName}</p>
          </motion.div>

          <Card className="glass-effect border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-blue-500" />
                <span>Digital Prescription</span>
              </CardTitle>
              <CardDescription>Complete the prescription for your patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Patient Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-medium">{appointment.patientName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <p className="font-medium">{appointment.age} years</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Symptoms:</span>
                    <p className="font-medium">{appointment.symptoms}</p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Diagnosis *</label>
                <Input
                  placeholder="Enter primary diagnosis"
                  value={prescription.diagnosis}
                  onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Medications</label>
                  <Button onClick={addMedication} size="sm" variant="outline" className="border-blue-300 text-blue-600">
                    <Pill className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
                
                {prescription.medications.map((med, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Medication name"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <Input
                        placeholder="Dosage (e.g., 10mg)"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Frequency (e.g., Once daily)"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Special instructions"
                          value={med.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          className="border-blue-200 focus:border-blue-400"
                        />
                        {prescription.medications.length > 1 && (
                          <Button
                            onClick={() => removeMedication(index)}
                            size="icon"
                            variant="outline"
                            className="border-red-300 text-red-600"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Care Instructions</label>
                <textarea
                  placeholder="Provide care instructions, lifestyle recommendations, etc."
                  value={prescription.instructions}
                  onChange={(e) => setPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full h-24 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                />
              </div>

              {/* Follow-up */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Follow-up Recommendation</label>
                <select
                  value={prescription.followUp}
                  onChange={(e) => setPrescription(prev => ({ ...prev, followUp: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select follow-up timeframe</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <Button onClick={handleSavePrescription} className="medical-gradient text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Send Prescription
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPrescription(false)}
                  className="border-gray-300"
                >
                  Back to Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 bg-gray-800 rounded-t-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="h-4 w-4" />
              <span>{formatTime(consultationTime)}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">Doctor Consultation</h1>
            <p className="text-gray-300">with {appointment.patientName}</p>
          </div>

          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            End & Prescribe
          </Button>
        </motion.div>

        {/* Main Video Area */}
        <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4 bg-gray-800">
          {/* Patient Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="h-full bg-gray-900 border-gray-700">
              <CardContent className="p-0 h-full relative">
                <div className="h-full bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {isConnected ? (
                    <>
                      <img  className="w-full h-full object-cover" alt="Patient video call" src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" />
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 text-white">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{appointment.patientName}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-lg">Connecting to {appointment.patientName}...</p>
                    </div>
                  )}
                </div>

                {/* Doctor Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                  {isVideoOn ? (
                    <img  className="w-full h-full object-cover" alt="Doctor video" src="https://images.unsplash.com/photo-1588966915713-6d43603478e5" />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <VideoOff className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs">You</span>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                    <Button
                      size="icon"
                      variant={isVideoOn ? "secondary" : "destructive"}
                      onClick={toggleVideo}
                      className="rounded-full"
                    >
                      {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant={isAudioOn ? "secondary" : "destructive"}
                      onClick={toggleAudio}
                      className="rounded-full"
                    >
                      {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className="rounded-full"
                    >
                      {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toast({
                        title: "🚧 Feature Coming Soon!",
                        description: "Screen sharing will be available soon! 🚀"
                      })}
                      className="rounded-full"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toast({
                        title: "🚧 Feature Coming Soon!",
                        description: "Fullscreen mode will be available soon! 🚀"
                      })}
                      className="rounded-full"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col space-y-4"
          >
            {/* Patient Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span>Patient Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-white font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <span className="text-gray-400">Age:</span>
                  <p className="text-white font-medium">{appointment.age} years</p>
                </div>
                <div>
                  <span className="text-gray-400">Symptoms:</span>
                  <p className="text-white">{appointment.symptoms}</p>
                </div>
                <div>
                  <span className="text-gray-400">Medical History:</span>
                  <p className="text-white">{appointment.medicalHistory}</p>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="flex-1 bg-gray-900 border-gray-700 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Chat Messages */}
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-64">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.sender === 'doctor'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-100'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowPrescription(true)}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Create Prescription
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => toast({
                    title: "🚧 Feature Coming Soon!",
                    description: "Notes feature will be available soon! 🚀"
                  })}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Take Notes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => toast({
                    title: "🚧 Feature Coming Soon!",
                    description: "Recording will be available soon! 🚀"
                  })}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Record Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultation;
