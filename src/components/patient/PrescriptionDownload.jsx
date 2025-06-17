
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Download, Share, FileText, Calendar, Clock, User, 
  Pill, AlertCircle, CheckCircle, Star, ArrowLeft, Home
} from 'lucide-react';

const PrescriptionDownload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Mock prescription data
    const mockPrescription = {
      id: id,
      consultationId: `CONS${id}`,
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiology",
      patientName: "John Doe",
      date: new Date().toISOString(),
      diagnosis: "Mild Hypertension",
      symptoms: "Elevated blood pressure, occasional headaches, fatigue",
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take with or without food, preferably at the same time each day"
        },
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in the morning with breakfast"
        }
      ],
      instructions: [
        "Monitor blood pressure daily and maintain a log",
        "Reduce sodium intake to less than 2300mg per day",
        "Exercise regularly - at least 30 minutes of moderate activity 5 days a week",
        "Follow up in 2 weeks to assess medication effectiveness"
      ],
      warnings: [
        "Do not stop medications abruptly without consulting your doctor",
        "Contact doctor immediately if you experience dizziness, fainting, or severe headaches",
        "Avoid grapefruit and grapefruit juice while taking Amlodipine"
      ],
      followUp: "2 weeks",
      doctorSignature: "Dr. Sarah Johnson, MD",
      licenseNumber: "MD123456"
    };
    setPrescription(mockPrescription);
  }, [id]);

  const handleDownload = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Prescription download will be available soon! 🚀"
    });
  };

  const handleShare = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Prescription sharing will be available soon! 🚀"
    });
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    // Store rating
    const ratingData = {
      consultationId: id,
      rating,
      feedback,
      submittedAt: new Date().toISOString()
    };

    const existingRatings = JSON.parse(localStorage.getItem('consultationRatings') || '[]');
    existingRatings.push(ratingData);
    localStorage.setItem('consultationRatings', JSON.stringify(existingRatings));

    toast({
      title: "Thank You!",
      description: "Your feedback has been submitted successfully"
    });

    navigate('/dashboard');
  };

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="border-blue-300 text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consultation Complete</h1>
              <p className="text-gray-600">Download your prescription and medical notes</p>
            </div>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="medical-gradient text-white">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Consultation Completed Successfully!</h3>
                  <p className="text-green-700">Your prescription and medical notes are ready for download.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prescription Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prescription Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader className="bg-blue-50 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-900">Medical Prescription</CardTitle>
                      <CardDescription className="text-gray-600">
                        Consultation ID: {prescription.consultationId}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-blue-300 text-blue-600">
                      <FileText className="h-4 w-4 mr-1" />
                      Digital Prescription
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Patient Name</span>
                        <p className="font-semibold text-gray-900">{prescription.patientName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Doctor</span>
                        <p className="font-semibold text-gray-900">{prescription.doctorName}</p>
                        <p className="text-sm text-blue-600">{prescription.doctorSpecialty}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Date</span>
                        <p className="font-semibold text-gray-900">
                          {new Date(prescription.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Diagnosis</span>
                        <p className="font-semibold text-gray-900">{prescription.diagnosis}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Pill className="h-5 w-5 text-blue-500" />
                    <span>Prescribed Medications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{med.name}</h4>
                        <Badge variant="outline" className="border-blue-300 text-blue-600">
                          {med.duration}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Dosage:</span>
                          <p className="font-medium">{med.dosage}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Frequency:</span>
                          <p className="font-medium">{med.frequency}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Instructions:</span>
                        <p className="text-gray-900 mt-1">{med.instructions}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>Care Instructions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {prescription.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{instruction}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Warnings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>Important Warnings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prescription.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{warning}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Download Options</CardTitle>
                  <CardDescription>Save your prescription and medical notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleDownload} className="w-full medical-gradient text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="w-full border-blue-300 text-blue-600">
                    <Share className="h-4 w-4 mr-2" />
                    Share Prescription
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Follow-up */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>Follow-up</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Next appointment recommended in:</p>
                    <p className="text-2xl font-bold text-blue-600">{prescription.followUp}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 border-blue-300 text-blue-600"
                      onClick={() => navigate('/search')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Book Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rate Consultation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Rate Your Experience</CardTitle>
                  <CardDescription>Help us improve our service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    placeholder="Share your feedback (optional)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full h-20 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none text-sm"
                  />
                  
                  <Button 
                    onClick={handleRatingSubmit}
                    className="w-full medical-gradient text-white"
                    disabled={rating === 0}
                  >
                    Submit Feedback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Doctor Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <img  className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-blue-200" alt="Doctor profile" src="https://images.unsplash.com/photo-1588966915713-6d43603478e5" />
                  <h3 className="font-semibold text-gray-900">{prescription.doctorName}</h3>
                  <p className="text-blue-600 text-sm mb-2">{prescription.doctorSpecialty}</p>
                  <p className="text-xs text-gray-600">License: {prescription.licenseNumber}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDownload;
