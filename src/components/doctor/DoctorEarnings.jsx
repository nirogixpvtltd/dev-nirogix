import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, BarChart3, DollarSign, Users, Star, Download,
  Calendar, Clock, FileText, Banknote
} from 'lucide-react';

const DoctorEarnings = () => {
  const navigate = useNavigate();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('doctorProfile') || '{}');
    setDoctorProfile(profile);

    // Mock earnings data
    const mockData = {
      daily: {
        total: 450,
        consultations: 3,
        chart: [100, 150, 200, 0, 150, 150, 0]
      },
      weekly: {
        total: 2850,
        consultations: 19,
        chart: [450, 600, 300, 750, 150, 600, 0]
      },
      monthly: {
        total: 11400,
        consultations: 76,
        chart: [2850, 2500, 3100, 2950]
      },
      transactions: [
        { id: 1, patient: 'John Doe', date: '2025-06-12', amount: 150, status: 'Paid' },
        { id: 2, patient: 'Jane Smith', date: '2025-06-12', amount: 150, status: 'Paid' },
        { id: 3, patient: 'Robert Brown', date: '2025-06-12', amount: 150, status: 'Paid' },
        { id: 4, patient: 'Emily White', date: '2025-06-11', amount: 150, status: 'Paid' },
        { id: 5, patient: 'Michael Green', date: '2025-06-11', amount: 150, status: 'Paid' },
      ]
    };
    setEarningsData(mockData);
  }, []);

  const handleDownloadReport = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Report download will be available soon! 🚀"
    });
  };

  const handleRequestPayout = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Payout requests will be available soon! 🚀"
    });
  };

  const BarChart = ({ data, period }) => {
    const maxValue = Math.max(...data);
    const labels = period === 'monthly' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="h-64 flex items-end space-x-4">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-400 rounded-t-lg hover:bg-blue-500 transition-all"
              style={{ height: `${(value / maxValue) * 100}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-2">{labels[index]}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!doctorProfile || !earningsData) {
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
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/doctor-availability')}
              className="border-blue-300 text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Earnings & Statistics</h1>
              <p className="text-gray-600">Track your performance and earnings</p>
            </div>
          </div>
          <Button onClick={handleDownloadReport} className="medical-gradient text-white">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily">
                  <Card className="border-blue-100">
                    <CardHeader>
                      <CardTitle>Daily Summary</CardTitle>
                      <CardDescription>Earnings for {new Date().toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-blue-600">${earningsData.daily.total}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Consultations</p>
                          <p className="text-2xl font-bold text-green-600">{earningsData.daily.consultations}</p>
                        </div>
                      </div>
                      <BarChart data={earningsData.daily.chart} period="daily" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="weekly">
                  <Card className="border-blue-100">
                    <CardHeader>
                      <CardTitle>Weekly Summary</CardTitle>
                      <CardDescription>Earnings for this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-blue-600">${earningsData.weekly.total}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Consultations</p>
                          <p className="text-2xl font-bold text-green-600">{earningsData.weekly.consultations}</p>
                        </div>
                      </div>
                      <BarChart data={earningsData.weekly.chart} period="weekly" />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="monthly">
                  <Card className="border-blue-100">
                    <CardHeader>
                      <CardTitle>Monthly Summary</CardTitle>
                      <CardDescription>Earnings for this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-blue-600">${earningsData.monthly.total}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Consultations</p>
                          <p className="text-2xl font-bold text-green-600">{earningsData.monthly.consultations}</p>
                        </div>
                      </div>
                      <BarChart data={earningsData.monthly.chart} period="monthly" />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your last 5 completed consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earningsData.transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Consultation with {tx.patient}</p>
                            <p className="text-sm text-gray-500">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+${tx.amount}</p>
                          <Badge variant="outline" className="border-green-300 text-green-600">{tx.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Available for Payout</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-4">${earningsData.monthly.total}</p>
                  <Button onClick={handleRequestPayout} className="w-full medical-gradient text-white">
                    <Banknote className="h-4 w-4 mr-2" />
                    Request Payout
                  </Button>
                  <p className="text-xs text-gray-500 mt-3">Next payout scheduled for 2025-07-01</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Patient Satisfaction</span>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultations this month</span>
                    <span className="font-semibold">{earningsData.monthly.consultations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Consultation Time</span>
                    <span className="font-semibold">22 mins</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is available to assist with any payment or earnings questions.
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

export default DoctorEarnings;