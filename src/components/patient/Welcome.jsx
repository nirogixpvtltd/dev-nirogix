import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { HeartPulse, ShieldCheck, Clock, Users, Phone, Mail } from 'lucide-react';
import { authService } from '@/lib/auth.service';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    try {
      setLoading(true);
      if (!email || !password || !name) {
        toast({
          title: "Required Fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      await authService.register(email, password, name);
      setShowOtp(true);
      toast({
        title: "Registration Successful!",
        description: "Please check your email for OTP verification"
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      if (!otp) {
        toast({
          title: "OTP Required",
          description: "Please enter the verification code",
          variant: "destructive"
        });
        return;
      }

      await authService.verifyOTP(email, otp);
      toast({
        title: "Email Verified!",
        description: "You can now login to your account"
      });
      setIsLogin(true);
      setShowOtp(false);
      setOtp('');
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        toast({
          title: "Required Fields",
          description: "Please enter email and password",
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting login with:', { email });
      const response = await login(email, password);
      console.log('Login response:', response);

      if (response.token) {
        toast({
          title: "Welcome to Nirogix!",
          description: "Login successful"
        });
        navigate('/dashboard');
      } else {
        throw new Error('Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToDoctorSignup = () => {
    navigate('/doctor-signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center space-x-3"
            >
              <div className="p-3 bg-primary rounded-full">
                <HeartPulse className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="text-4xl font-extrabold font-heading text-primary">Nirogix</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-foreground leading-tight">
              Doctor ab
              <span className="text-primary block">direct hai.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with certified doctors instantly. Get expert medical consultation from the comfort of your home with our secure telemedicine platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, title: "Secure & Private", desc: "End-to-end encrypted consultations" },
              { icon: Clock, title: "24/7 Available", desc: "Round-the-clock medical support" },
              { icon: Users, title: "Expert Doctors", desc: "Certified healthcare professionals" },
              { icon: HeartPulse, title: "Trusted Care", desc: "Quality healthcare you can trust" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 bg-background/60 backdrop-blur-sm rounded-lg border"
              >
                <feature.icon className="h-7 w-7 text-accent mb-2" />
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <img className="w-full h-64 object-cover rounded-2xl shadow-lg floating-animation" alt="Happy patient having a video call with a doctor on a laptop" src="https://images.unsplash.com/photo-1585092284034-48c72302862c" />
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          <Card className="glass-effect shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">
                {showOtp ? 'Verify Email' : isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {showOtp
                  ? 'Enter the verification code sent to your email'
                  : isLogin
                    ? 'Sign in to access your healthcare dashboard'
                    : 'Join our healthcare community'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showOtp ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Verification Code</label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="text-center text-lg tracking-widest focus:ring-accent"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleVerifyOTP}
                    className="w-full medical-gradient text-primary-foreground font-semibold py-3 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300"
                  >
                    Verify Email
                  </Button>
                </>
              ) : (
                <>
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Full Name</label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="focus:ring-accent"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus:ring-accent"
                    />
                  </div>

                  <Button
                    onClick={isLogin ? handleLogin : handleRegister}
                    className="w-full medical-gradient text-primary-foreground font-semibold py-3 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full text-primary hover:text-primary/90"
                  >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-secondary/50">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Are you a Doctor?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our platform and expand your practice.
              </p>
              <Button
                variant="outline"
                onClick={navigateToDoctorSignup}
                className="text-primary border-primary hover:bg-primary/10 hover:text-primary"
              >
                Doctor Registration
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;