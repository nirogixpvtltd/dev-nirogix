import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Star, Clock, DollarSign, Filter, HeartPulse, User } from 'lucide-react';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockDoctors = [
      { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", rating: 4.9, experience: "15 years", fee: 150, location: "New York", availability: "Available Now", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400", consultations: 1250, languages: ["English", "Spanish"] },
      { id: 2, name: "Dr. Michael Chen", specialty: "Dermatology", rating: 4.8, experience: "12 years", fee: 120, location: "California", availability: "Next: 2:30 PM", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400", consultations: 980, languages: ["English", "Mandarin"] },
      { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics", rating: 4.9, experience: "10 years", fee: 100, location: "Texas", availability: "Available Now", image: "https://images.unsplash.com/photo-1594824475317-d8b0b4b5b8b5?w=400", consultations: 1500, languages: ["English", "Spanish"] },
      { id: 4, name: "Dr. James Wilson", specialty: "Neurology", rating: 4.7, experience: "20 years", fee: 200, location: "Florida", availability: "Next: 4:00 PM", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400", consultations: 2100, languages: ["English"] },
      { id: 5, name: "Dr. Lisa Thompson", specialty: "Psychiatry", rating: 4.8, experience: "8 years", fee: 180, location: "Washington", availability: "Available Now", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400", consultations: 750, languages: ["English", "French"] },
      { id: 6, name: "Dr. Robert Kumar", specialty: "Orthopedics", rating: 4.6, experience: "18 years", fee: 160, location: "Illinois", availability: "Next: 6:00 PM", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400", consultations: 1800, languages: ["English", "Hindi"] }
    ];
    setDoctors(mockDoctors);
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !specialty || doctor.specialty === specialty;
    const matchesLocation = !location || doctor.location.toLowerCase().includes(location.toLowerCase());
    const matchesPrice = !priceRange || 
      (priceRange === 'low' && doctor.fee <= 100) ||
      (priceRange === 'medium' && doctor.fee > 100 && doctor.fee <= 150) ||
      (priceRange === 'high' && doctor.fee > 150);
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesPrice;
  });

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`);
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-full">
              <HeartPulse className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold font-heading text-primary">Nirogix</span>
          </div>
          <Button onClick={navigateToDashboard} variant="outline">
            <User className="h-4 w-4 mr-2" />
            My Dashboard
          </Button>
        </header>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">Find Your Doctor</h1>
          <p className="text-lg text-muted-foreground">Connect with certified healthcare professionals</p>
        </div>

        <Card className="glass-effect shadow-lg shadow-primary/5 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors or specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger><SelectValue placeholder="Specialty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger><SelectValue placeholder="Price Range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Price</SelectItem>
                  <SelectItem value="low">$50 - $100</SelectItem>
                  <SelectItem value="medium">$100 - $150</SelectItem>
                  <SelectItem value="high">$150+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {filteredDoctors.length} Doctors Available
          </h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Sorted by availability</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => handleDoctorClick(doctor.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20 border-2">
                      <AvatarImage src={doctor.image} alt={doctor.name} />
                      <AvatarFallback className="bg-secondary text-primary text-xl font-semibold">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-primary font-medium">
                        {doctor.specialty}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-foreground">{doctor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{doctor.consultations} consultations</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <Badge 
                      className={doctor.availability.includes('Available') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-secondary'}
                    >
                      {doctor.availability}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xl font-bold text-primary">${doctor.fee}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full medical-gradient text-primary-foreground hover:opacity-90 transition-opacity">
                    Book Consultation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <img  className="w-64 h-64 mx-auto mb-6 opacity-40" alt="Illustration of a doctor looking at a file with a magnifying glass" src="https://images.unsplash.com/photo-1680759290895-d8225982e197" />
              <h3 className="text-2xl font-bold text-foreground mb-2">No Doctors Found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or browse all available doctors.</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default DoctorSearch;