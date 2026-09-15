import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Award,
  Download,
  Eye,
  Plus
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const Fundraising = () => {
  const [donationAmount, setDonationAmount] = useState("");

  const currentCampaigns = [
    {
      id: 1,
      title: "Student Scholarship Fund 2024",
      description: "Supporting deserving students with financial assistance for their education",
      target: 5000000,
      raised: 3750000,
      donors: 156,
      daysLeft: 45,
      category: "Education",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Campus Infrastructure Development", 
      description: "Upgrading labs, library, and student facilities",
      target: 10000000,
      raised: 6200000,
      donors: 89,
      daysLeft: 60,
      category: "Infrastructure",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Alumni Emergency Support Fund",
      description: "Helping alumni during medical emergencies and financial crises",
      target: 2000000,
      raised: 1450000,
      donors: 203,
      daysLeft: 30,
      category: "Emergency",
      image: "/placeholder.svg"
    }
  ];

  const recentDonors = [
    {
      name: "Priya Sharma",
      batch: "2018",
      amount: 50000,
      message: "Happy to support the scholarship fund!",
      anonymous: false,
      date: "2 hours ago"
    },
    {
      name: "Anonymous Donor",
      batch: "2020", 
      amount: 25000,
      message: "Education is the best investment.",
      anonymous: true,
      date: "5 hours ago"
    },
    {
      name: "Arjun Patel",
      batch: "2019",
      amount: 75000,
      message: "Proud to give back to my alma mater.",
      anonymous: false,
      date: "1 day ago"
    }
  ];

  const topDonors = [
    { name: "Rajesh Kumar", batch: "2015", total: 500000, campaigns: 8 },
    { name: "Neha Singh", batch: "2017", total: 350000, campaigns: 5 },
    { name: "Amit Sharma", batch: "2016", total: 300000, campaigns: 6 },
    { name: "Priya Gupta", batch: "2018", total: 250000, campaigns: 4 },
    { name: "Rohit Patel", batch: "2019", total: 200000, campaigns: 3 }
  ];

  const impactStats = [
    { label: "Students Supported", value: "324", icon: Users },
    { label: "Total Funds Raised", value: "₹1.2Cr", icon: DollarSign },
    { label: "Active Campaigns", value: "8", icon: Target },
    { label: "Alumni Donors", value: "567", icon: Heart }
  ];

  const expenditureData = [
    { category: "Student Scholarships", amount: 4500000, percentage: 45 },
    { category: "Infrastructure", amount: 3000000, percentage: 30 },
    { category: "Emergency Fund", amount: 1500000, percentage: 15 },
    { category: "Administrative", amount: 1000000, percentage: 10 }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alumni Fundraising</h1>
              <p className="text-muted-foreground">Supporting our community through collective giving</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Annual Report
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Start Campaign
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="campaigns" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
              <TabsTrigger value="transparency">Transparency</TabsTrigger>
              <TabsTrigger value="donors">Donor Recognition</TabsTrigger>
              <TabsTrigger value="impact">Impact Report</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {currentCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-primary"></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{campaign.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {campaign.daysLeft} days left
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {campaign.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.description}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Raised: ₹{(campaign.raised / 100000).toFixed(1)}L</span>
                            <span>Target: ₹{(campaign.target / 100000).toFixed(1)}L</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.target) * 100} />
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{((campaign.raised / campaign.target) * 100).toFixed(0)}% funded</span>
                            <span>{campaign.donors} donors</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">Donate Now</Button>
                          <Button variant="outline" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Donation */}
              <Card>
                <CardHeader>
                  <CardTitle>Make a Quick Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    {[1000, 5000, 10000, 25000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        ₹{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transparency" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Fund Utilization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {expenditureData.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm">₹{(item.amount / 100000).toFixed(1)}L</span>
                        </div>
                        <Progress value={item.percentage} />
                        <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentDonors.map((donor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {donor.anonymous ? "?" : donor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">{donor.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">₹{donor.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{donor.batch}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="donors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topDonors.map((donor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <Avatar>
                            <AvatarFallback>
                              {donor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{donor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {donor.batch} • {donor.campaigns} campaigns supported
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-success">
                            ₹{(donor.total / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-muted-foreground">Total contributed</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle>Impact Dashboard</CardTitle>
                  <p className="text-muted-foreground">See how your contributions are making a difference</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Success Stories</h3>
                      <div className="space-y-3">
                        <div className="p-4 border border-border rounded-lg">
                          <p className="text-sm font-medium">50 students received full scholarships</p>
                          <p className="text-xs text-muted-foreground">Through the 2023 scholarship program</p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <p className="text-sm font-medium">New computer lab established</p>
                          <p className="text-xs text-muted-foreground">Serving 200+ students daily</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Upcoming Projects</h3>
                      <div className="space-y-3">
                        <div className="p-4 border border-border rounded-lg">
                          <p className="text-sm font-medium">Digital Library Expansion</p>
                          <p className="text-xs text-muted-foreground">Target: ₹15L • Progress: 60%</p>
                        </div>
                        <div className="p-4 border border-border rounded-lg">
                          <p className="text-sm font-medium">Student Hostel Renovation</p>
                          <p className="text-xs text-muted-foreground">Target: ₹25L • Progress: 30%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Fundraising;