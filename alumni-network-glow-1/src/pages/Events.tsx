import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  Loader
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiService, GradEvent } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Events = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'mine'>('upcoming');
  const [events, setEvents] = useState<GradEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', mode: 'Virtual' as 'Virtual' | 'In-Person', location: '', speaker: '', speakerRole: '', capacity: '100' });

  const fetchEvents = async (scope: 'upcoming' | 'past' | 'mine') => {
    setIsLoading(true);
    try {
      const data = await apiService.listEvents(scope);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date) {
      toast({ title: "Validation Error", description: "Please provide a title and date", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.createEvent({ ...form, capacity: Number(form.capacity) || 100 });
      toast({ title: "Success", description: "Event created" });
      setForm({ title: '', description: '', date: '', time: '', mode: 'Virtual', location: '', speaker: '', speakerRole: '', capacity: '100' });
      setIsCreateOpen(false);
      fetchEvents(tab);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create event", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (id: string) => {
    try {
      await apiService.registerForEvent(id);
      toast({ title: "Registered", description: "You're registered for this event" });
      fetchEvents(tab);
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to register", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Events & Workshops</h1>
              <p className="text-muted-foreground">Webinars, workshops, and networking events</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Host Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Host a New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    <Input placeholder="Time (e.g. 2:00 PM - 3:00 PM)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                  <Input placeholder="Speaker name" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} />
                  <Input placeholder="Speaker role" value={form.speakerRole} onChange={(e) => setForm({ ...form, speakerRole: e.target.value })} />
                  <Input placeholder="Location (if in-person)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                  <Button className="w-full" onClick={handleCreate} disabled={isSubmitting}>
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="mine">My Events</TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : events.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    {tab === 'mine' ? "You haven't registered for any events yet." : "No events to show."}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-2/3 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{event.type}</Badge>
                                  {event.mode === "Virtual" ? (
                                    <Badge variant="outline" className="flex items-center gap-1"><Video className="w-3 h-3" />Virtual</Badge>
                                  ) : (
                                    <Badge variant="outline" className="flex items-center gap-1"><MapPin className="w-3 h-3" />In-Person</Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date}</div>
                              {event.time && <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{event.time}</div>}
                              {event.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</div>}
                            </div>

                            <p className="text-muted-foreground">{event.description}</p>
                          </div>

                          <div className="lg:w-1/3 space-y-4">
                            {event.speaker && (
                              <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                                <Avatar>
                                  <AvatarFallback>{event.speaker.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{event.speaker}</p>
                                  <p className="text-xs text-muted-foreground">{event.speakerRole}</p>
                                </div>
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Registered:</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.registered}/{event.capacity}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}></div>
                              </div>
                              {tab === 'upcoming' && (
                                <Button
                                  className="w-full"
                                  disabled={event.isRegistered || event.registered >= event.capacity}
                                  onClick={() => handleRegister(event.id)}
                                >
                                  {event.isRegistered ? 'Registered' : event.registered >= event.capacity ? 'Full' : 'Register Now'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Events;
