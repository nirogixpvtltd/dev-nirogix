import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, Star, MapPin, Clock, DollarSign, Calendar, 
  Award, Users, HeartPulse, CheckCircle, MessageCircle, Video 
} from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch this data from an API based on the `id`
    const mockDoctor = {
      id: parseInt(id),
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 4.9,
      experience: "15 years",
      fee: 150,
      location: "New York",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      consultations: 1250,
      languages: ["English", "Spanish"],
      education: ["MD - Harvard Medical School", "Residency - Johns Hopkins Hospital", "Fellowship - Mayo Clinic"],
      certifications: ["Board Certified Cardiologist", "American Heart Association Fellow", "Interventional Cardiology Specialist"],
      about: "Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of practice. She specializes in preventive cardiology, heart disease management, and interventional procedures. Dr. Johnson is committed to providing personalized care and helping patients achieve optimal heart health.",
      availableSlots: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"],
      reviews: [
        { id: 1, patient: "John D.", rating: 5, comment: "Excellent doctor! Very thorough and caring. Explained everything clearly.", date: "2 days ago" },
        { id: 2, patient: "Maria S.", rating: 5, comment: "Dr. Johnson helped me understand my condition and provided great treatment options.", date: "1 week ago" },
        { id: 3, patient: "Robert K.", rating: 4, comment: "Professional and knowledgeable. The consultation was very helpful.", date: "2 weeks ago" }
      ]
    };
    setDoctor(mockDoctor);
  }, [id]);

  const handleBookAppointment = () => {
    if (!selectedTimeSlot) {
      toast({ title: "Select Time Slot", description: "Please select an available time slot", variant: "destructive" });
      return;
    }
    navigate(`/booking/${id}`, { state: { timeSlot: selectedTimeSlot } });
  };

  const handleInstantConsultation = () => {
    toast({ title: "🚧 Feature Coming Soon!", description: "Instant consultation will be available soon. Please book a scheduled appointment for now! 🚀" });
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Button variant="outline" size="icon" onClick={() => navigate('/search')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Doctor Profile</h1>
            <p className="text-muted-foreground">View details and book a consultation</p>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-effect shadow-lg shadow-primary/5">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback className="bg-secondary text-primary text-3xl font-semibold">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-foreground mb-1">{doctor.name}</h2>
                      <p className="text-primary font-semibold text-xl mb-3">{doctor.specialty}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-muted-foreground">
                        <div className="flex items-center space-x-2"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> <span className="font-medium text-foreground">{doctor.rating}</span> <span>({doctor.reviews.length} reviews)</span></div>
                        <div className="flex items-center space-x-2"><Clock className="h-5 w-5" /> <span>{doctor.experience} experience</span></div>
                        <div className="flex items-center space-x-2"><MapPin className="h-5 w-5" /> <span>{doctor.location}</span></div>
                      </div>
                      <div className="flex flex-wrap gap-2">{doctor.languages.map((lang, idx) => (<Badge key={idx} variant="secondary">{lang}</Badge>))}</div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card><CardHeader><CardTitle className="flex items-center space-x-2"><HeartPulse className="h-5 w-5 text-primary" /><span>About Dr. {doctor.name.split(' ')[1]}</span></CardTitle></CardHeader><CardContent><p className="text-muted-foreground leading-relaxed">{doctor.about}</p></CardContent></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle className="flex items-center space-x-2"><Award className="h-5 w-5 text-primary" /><span>Education</span></CardTitle></CardHeader><CardContent><ul className="space-y-2">{doctor.education.map((edu, idx) => (<li key={idx} className="flex items-start space-x-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /><span className="text-muted-foreground">{edu}</span></li>))}</ul></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center space-x-2"><Award className="h-5 w-5 text-primary" /><span>Certifications</span></CardTitle></CardHeader><CardContent><ul className="space-y-2">{doctor.certifications.map((cert, idx) => (<li key={idx} className="flex items-start space-x-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /><span className="text-muted-foreground">{cert}</span></li>))}</ul></CardContent></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card><CardHeader><CardTitle className="flex items-center space-x-2"><MessageCircle className="h-5 w-5 text-primary" /><span>Patient Reviews</span></CardTitle></CardHeader><CardContent className="space-y-4">{doctor.reviews.map((review) => (<div key={review.id} className="border-b pb-4 last:border-b-0"><div className="flex items-center justify-between mb-2"><div className="flex items-center space-x-2"><span className="font-medium text-foreground">{review.patient}</span><div className="flex items-center">{[...Array(review.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />))}</div></div><span className="text-sm text-muted-foreground">{review.date}</span></div><p className="text-muted-foreground">{review.comment}</p></div>))}</CardContent></Card>
            </motion.div>
          </main>

          <aside className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-effect shadow-lg shadow-primary/5 text-center"><CardHeader><CardTitle className="flex items-center justify-center space-x-2"><DollarSign className="h-7 w-7 text-primary" /><span className="text-4xl font-bold text-primary">${doctor.fee}</span></CardTitle><CardDescription>Consultation Fee</CardDescription></CardHeader></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card><CardHeader><CardTitle>Quick Consultation</CardTitle><CardDescription>Start an instant video call</CardDescription></CardHeader><CardContent><Button onClick={handleInstantConsultation} className="w-full bg-green-500 hover:bg-green-600 text-white"><Video className="h-4 w-4 mr-2" />Start Now</Button></CardContent></Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="sticky top-8">
              <Card><CardHeader><CardTitle className="flex items-center space-x-2"><Calendar className="h-5 w-5 text-primary" /><span>Available Today</span></CardTitle><CardDescription>Select a time for your consultation</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">{doctor.availableSlots.map((slot) => (<Button key={slot} variant={selectedTimeSlot === slot ? "default" : "outline"} size="sm" onClick={() => setSelectedTimeSlot(slot)} className={selectedTimeSlot === slot ? "medical-gradient text-primary-foreground" : ""}>{slot}</Button>))}</div>
                  <Button onClick={handleBookAppointment} className="w-full medical-gradient text-primary-foreground hover:opacity-90 transition-opacity" disabled={!selectedTimeSlot}>Book Appointment</Button>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;