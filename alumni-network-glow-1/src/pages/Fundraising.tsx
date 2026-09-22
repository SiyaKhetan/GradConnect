import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Heart,
  Target,
  Users,
  DollarSign,
  Award,
  Plus,
  Loader
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiService, Campaign, Donation, TopDonor } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Fundraising = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<TopDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donateOpenId, setDonateOpenId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Education', target: '' });

  const fetchAll = async () => {
    try {
      const [c, d, t] = await Promise.all([
        apiService.listCampaigns(),
        apiService.listDonations(),
        apiService.topDonors(),
      ]);
      setCampaigns(c);
      setDonations(d);
      setDonors(t);
    } catch (error) {
      console.error('Error loading fundraising data:', error);
      toast({ title: "Error", description: "Failed to load fundraising data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCampaign = async () => {
    const target = Number(form.target);
    if (!form.title.trim() || !target || target <= 0) {
      toast({ title: "Validation Error", description: "Please provide a title and a positive target amount", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.createCampaign({ ...form, target });
      toast({ title: "Success", description: "Campaign created" });
      setForm({ title: '', description: '', category: 'Education', target: '' });
      setIsCreateOpen(false);
      fetchAll();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create campaign", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonate = async (campaignId: string) => {
    const amount = Number(donationAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Validation Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setIsDonating(true);
    try {
      await apiService.donate(campaignId, { amount, message: donationMessage });
      toast({ title: "Thank you!", description: "Your donation has been recorded" });
      setDonationAmount("");
      setDonationMessage("");
      setDonateOpenId(null);
      fetchAll();
    } catch (error) {
      console.error('Error donating:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to record donation", variant: "destructive" });
    } finally {
      setIsDonating(false);
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonations = campaigns.reduce((sum, c) => sum + c.donorCount, 0);

  const impactStats = [
    { label: "Total Funds Raised", value: `₹${totalRaised.toLocaleString()}`, icon: DollarSign },
    { label: "Active Campaigns", value: String(campaigns.length), icon: Target },
    { label: "Total Donations", value: String(totalDonations), icon: Heart },
    { label: "Top Donors", value: String(donors.length), icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center"><Loader className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

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
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Start a Fundraising Campaign</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Campaign title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Input placeholder="Category (e.g. Education)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <Input type="number" placeholder="Target amount (₹)" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                  <Button className="w-full" onClick={handleCreateCampaign} disabled={isSubmitting}>
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
              <TabsTrigger value="donors">Donor Recognition</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-6">
              {campaigns.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No campaigns yet — start one above.</p>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  {campaigns.map((campaign) => (
                    <Card key={campaign.id} className="overflow-hidden">
                      <div className="h-32 bg-gradient-primary"></div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <Badge variant="secondary" className="mb-2">{campaign.category}</Badge>
                            <h3 className="text-lg font-semibold text-foreground">{campaign.title}</h3>
                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Raised: ₹{campaign.raised.toLocaleString()}</span>
                              <span>Target: ₹{campaign.target.toLocaleString()}</span>
                            </div>
                            <Progress value={Math.min(100, (campaign.raised / campaign.target) * 100)} />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{((campaign.raised / campaign.target) * 100).toFixed(0)}% funded</span>
                              <span>{campaign.donorCount} donors</span>
                            </div>
                          </div>

                          <Dialog open={donateOpenId === campaign.id} onOpenChange={(open) => setDonateOpenId(open ? campaign.id : null)}>
                            <DialogTrigger asChild>
                              <Button className="w-full">Donate Now</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Donate to {campaign.title}</DialogTitle></DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-2 flex-wrap">
                                  {[500, 1000, 5000, 10000].map((amount) => (
                                    <Button key={amount} variant="outline" onClick={() => setDonationAmount(String(amount))}>₹{amount.toLocaleString()}</Button>
                                  ))}
                                </div>
                                <Input placeholder="Enter amount" type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
                                <Textarea placeholder="Message (optional)" value={donationMessage} onChange={(e) => setDonationMessage(e.target.value)} />
                                <Button className="w-full bg-gradient-primary hover:opacity-90" onClick={() => handleDonate(campaign.id)} disabled={isDonating}>
                                  {isDonating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
                                  Confirm Donation
                                </Button>
                                <p className="text-xs text-muted-foreground text-center">
                                  This records your donation in GradConnect. No payment is processed.
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Recent Donations */}
              <Card>
                <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {donations.length === 0 ? (
                    <p className="text-muted-foreground">No donations yet.</p>
                  ) : (
                    donations.map((donor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">{donor.anonymous || !donor.donor ? "?" : donor.donor.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{donor.anonymous || !donor.donor ? "Anonymous Donor" : donor.donor.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(donor.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">₹{donor.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{donor.donor?.batch || ''}</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
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
                  {donors.length === 0 ? (
                    <p className="text-muted-foreground">No donors yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {donors.map((donor, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'
                            }`}>
                              {index + 1}
                            </div>
                            <Avatar><AvatarFallback>{donor.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-semibold">{donor.name}</p>
                              <p className="text-sm text-muted-foreground">{donor.batch} • {donor.campaigns} campaigns supported</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-success">₹{donor.total.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total contributed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
