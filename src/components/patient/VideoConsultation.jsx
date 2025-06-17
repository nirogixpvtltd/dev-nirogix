
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { 
  Video, VideoOff, Mic, MicOff, Phone, MessageCircle, 
  Settings, Maximize, Volume2, VolumeX, Clock, User,
  FileText, Camera, Monitor, PhoneOff
} from 'lucide-react';

const VideoConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [consultationTime, setConsultationTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Mock appointment data
    const mockAppointment = {
      id: id,
      doctorName: "Dr. Sarah Johnson",
      patientName: "John Doe",
      specialty: "Cardiology",
      startTime: new Date(),
      duration: 30
    };
    setAppointment(mockAppointment);

    // Simulate connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "Connected!",
        description: "You are now connected with your doctor"
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
      sender: 'patient',
      message: chatMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        sender: 'doctor',
        message: "Thank you for sharing that information. I'll review your symptoms.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };

  const handleEndCall = () => {
    toast({
      title: "Consultation Ended",
      description: "Thank you for using MediConnect"
    });
    navigate(`/prescription/${id}`);
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

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast({
      title: isSpeakerOn ? "Speaker Off" : "Speaker On",
      description: `Speaker is now ${isSpeakerOn ? 'disabled' : 'enabled'}`
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Fullscreen mode will be available soon! 🚀"
    });
  };

  const handleScreenShare = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Screen sharing will be available soon! 🚀"
    });
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
            <h1 className="text-xl font-semibold text-white">Video Consultation</h1>
            <p className="text-gray-300">with {appointment.doctorName}</p>
          </div>

          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="bg-red-600 hover:bg-red-700"
          >
            <PhoneOff className="h-4 w-4 mr-2" />
            End Call
          </Button>
        </motion.div>

        {/* Main Video Area */}
        <div className="flex-1 grid lg:grid-cols-4 gap-4 p-4 bg-gray-800">
          {/* Doctor Video */}
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
                      <img  className="w-full h-full object-cover" alt="Doctor video call" src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" />
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 text-white">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{appointment.doctorName}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-lg">Connecting to {appointment.doctorName}...</p>
                    </div>
                  )}
                </div>

                {/* Patient Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 overflow-hidden">
                  {isVideoOn ? (
                    <img  className="w-full h-full object-cover" alt="Patient video" src="https://images.unsplash.com/photo-1675270714610-11a5cadcc7b3" />
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
                      onClick={toggleSpeaker}
                      className="rounded-full"
                    >
                      {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleScreenShare}
                      className="rounded-full"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={toggleFullscreen}
                      className="rounded-full"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <Card className="flex-1 bg-gray-900 border-gray-700 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Chat Messages */}
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-96">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.sender === 'patient'
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
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4 bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => toast({
                    title: "🚧 Feature Coming Soon!",
                    description: "File sharing will be available soon! 🚀"
                  })}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Share Files
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => toast({
                    title: "🚧 Feature Coming Soon!",
                    description: "Settings will be available soon! 🚀"
                  })}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
