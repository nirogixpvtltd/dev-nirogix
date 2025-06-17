import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { doctorService } from '@/lib/doctor.service';
import {
  ArrowLeft, User, Mail, Phone, GraduationCap,
  FileText, Upload, CheckCircle, Shield, Award
} from 'lucide-react';

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    licenseNumber: '',
    education: '',
    certifications: '',
    about: '',
    consultationFee: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.specialty;
      case 2:
        return formData.licenseNumber && formData.education && formData.experience;
      case 3:
        return formData.consultationFee && formData.about;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Prepare the data for registration
      const doctorData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialty,
        experience: parseInt(formData.experience),
        licenseNumber: formData.licenseNumber,
        education: formData.education,
        certifications: formData.certifications,
        bio: formData.about,
        consultationFee: parseFloat(formData.consultationFee),
        role: 'doctor'
      };

      // Call the registration API
      const response = await doctorService.register(doctorData);

      toast({
        title: "Registration Successful!",
        description: "Your profile is under review. We'll contact you within 24-48 hours."
      });

      // Navigate to doctor dashboard or availability setup
      navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (type) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Document upload will be available soon! 🚀"
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="border-blue-300 text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Registration</h1>
            <p className="text-gray-600">Join our platform and start providing telemedicine consultations</p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= stepNumber
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-12">
            <span className={`text-sm ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Basic Info
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Credentials
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Profile Setup
            </span>
            <span className={`text-sm ${step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              Verification
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {step === 1 && <User className="h-5 w-5 text-blue-500" />}
                    {step === 2 && <GraduationCap className="h-5 w-5 text-blue-500" />}
                    {step === 3 && <FileText className="h-5 w-5 text-blue-500" />}
                    {step === 4 && <Shield className="h-5 w-5 text-blue-500" />}
                    <span>
                      {step === 1 && "Basic Information"}
                      {step === 2 && "Professional Credentials"}
                      {step === 3 && "Profile Setup"}
                      {step === 4 && "Document Verification"}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {step === 1 && "Tell us about yourself"}
                    {step === 2 && "Provide your medical credentials"}
                    {step === 3 && "Complete your professional profile"}
                    {step === 4 && "Upload required documents for verification"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {step === 1 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name *</label>
                        <Input
                          placeholder="Dr. John Smith"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="doctor@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="pl-10 border-blue-200 focus:border-blue-400"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="pl-10 border-blue-200 focus:border-blue-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Medical Specialty *</label>
                        <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Select your specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="general">General Medicine</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Medical License Number *</label>
                          <Input
                            placeholder="MD123456"
                            value={formData.licenseNumber}
                            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Years of Experience *</label>
                          <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="4-7">4-7 years</SelectItem>
                              <SelectItem value="8-15">8-15 years</SelectItem>
                              <SelectItem value="15+">15+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Education *</label>
                        <textarea
                          placeholder="MD - Harvard Medical School, Residency - Johns Hopkins Hospital..."
                          value={formData.education}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          className="w-full h-24 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Certifications</label>
                        <textarea
                          placeholder="Board Certified Cardiologist, American Heart Association Fellow..."
                          value={formData.certifications}
                          onChange={(e) => handleInputChange('certifications', e.target.value)}
                          className="w-full h-24 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Consultation Fee (USD) *</label>
                        <Input
                          type="number"
                          placeholder="150"
                          value={formData.consultationFee}
                          onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                          className="border-blue-200 focus:border-blue-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">About You *</label>
                        <textarea
                          placeholder="Tell patients about your experience, approach to medicine, and what makes you unique..."
                          value={formData.about}
                          onChange={(e) => handleInputChange('about', e.target.value)}
                          className="w-full h-32 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Required Documents</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                            <div>
                              <h4 className="font-medium text-gray-900">Medical License</h4>
                              <p className="text-sm text-gray-600">Upload a clear copy of your medical license</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload('license')}
                              className="border-blue-300 text-blue-600"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                            <div>
                              <h4 className="font-medium text-gray-900">Medical Degree</h4>
                              <p className="text-sm text-gray-600">Upload your medical degree certificate</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload('degree')}
                              className="border-blue-300 text-blue-600"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                            <div>
                              <h4 className="font-medium text-gray-900">Professional Photo</h4>
                              <p className="text-sm text-gray-600">Upload a professional headshot</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileUpload('photo')}
                              className="border-blue-300 text-blue-600"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 text-green-700">
                          <Shield className="h-5 w-5" />
                          <span className="font-medium">Verification Process</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Our medical team will review your credentials within 24-48 hours. You'll receive an email notification once approved.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    {step > 1 && (
                      <Button variant="outline" onClick={handlePrevious} className="border-blue-300 text-blue-600">
                        Previous
                      </Button>
                    )}
                    {step < 4 ? (
                      <Button onClick={handleNext} className="medical-gradient text-white ml-auto">
                        Next Step
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} className="medical-gradient text-white ml-auto">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Application
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span>Why Join MediConnect?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Flexible Schedule</h4>
                      <p className="text-sm text-gray-600">Set your own availability and work hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Competitive Earnings</h4>
                      <p className="text-sm text-gray-600">Keep 85% of consultation fees</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Secure Platform</h4>
                      <p className="text-sm text-gray-600">HIPAA-compliant telemedicine tools</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Technical and administrative assistance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Valid medical license</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Medical degree from accredited institution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Minimum 1 year clinical experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Professional liability insurance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Reliable internet connection</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our team is here to assist you with the registration process.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-600">
                    Contact Support
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

export default DoctorSignup;
