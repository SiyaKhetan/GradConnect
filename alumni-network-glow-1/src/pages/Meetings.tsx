import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Check, Loader } from "lucide-react";
import { apiService, Meeting as MeetingType, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Meetings = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    recipientId: (location.state as { userId?: string })?.userId || '',
    date: '',
    time: '',
    topic: '',
  });

  const fetchMeetings = async () => {
    try {
      const data = await apiService.listMeetings();
      setMeetings(data);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({ title: "Error", description: "Failed to load meetings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    apiService.listUsers().then(setUsers).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!form.recipientId || !form.date || !form.time || !form.topic.trim()) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.requestMeeting({ recipientId: form.recipientId, date: form.date, time: form.time, topic: form.topic.trim() });
      toast({ title: "Success", description: "Meeting request sent!" });
      setForm({ recipientId: '', date: '', time: '', topic: '' });
      await fetchMeetings();
    } catch (error) {
      console.error('Error requesting meeting:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to request meeting", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const respond = async (id: string, status: 'accepted' | 'declined' | 'completed' | 'cancelled') => {
    try {
      await apiService.respondToMeeting(id, status);
      await fetchMeetings();
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({ title: "Error", description: "Failed to update meeting", variant: "destructive" });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'completed': return 'secondary';
      case 'declined':
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Meeting Scheduler</h1>
              <p className="text-muted-foreground">View availability and schedule mentorship sessions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Your Meetings</span>
                  </CardTitle>
                  <CardDescription>Requested, upcoming, and past sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : meetings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No meetings yet. Request one to get started.</p>
                  ) : (
                    <div className="space-y-3">
                      {meetings.map((m) => {
                        const otherName = m.isMine ? m.recipient?.name : m.requester?.name;
                        return (
                          <div key={m.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground">{m.topic}</h4>
                                <Badge variant={statusColor(m.status)} className="text-xs capitalize">{m.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {m.isMine ? 'With' : 'From'} {otherName} · {m.date} at {m.time}
                              </p>
                            </div>
                            {!m.isMine && m.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => respond(m.id, 'accepted')}>Accept</Button>
                                <Button size="sm" variant="ghost" onClick={() => respond(m.id, 'declined')}>Decline</Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Schedule a Meeting</span>
                  </CardTitle>
                  <CardDescription>Pick a person, date and time and request a meeting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">With</label>
                    <Select value={form.recipientId} onValueChange={(value) => setForm({ ...form, recipientId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a person" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name} ({u.userType})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Time</label>
                    <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Topic</label>
                    <Input
                      placeholder="e.g., Resume review, Mock interview"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    />
                  </div>
                  <Button className="w-full btn-professional bg-gradient-primary hover:opacity-90" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Request Meeting
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
