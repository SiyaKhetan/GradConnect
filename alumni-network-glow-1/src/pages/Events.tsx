import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  Bell,
  ExternalLink
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const upcomingEvents = [
    {
      id: 1,
      title: "AI/ML Career Transition Workshop",
      type: "Workshop",
      date: "2024-02-15",
      time: "2:00 PM - 4:00 PM IST",
      mode: "Virtual",
      speaker: "Dr. Ananya Kumar",
      speakerRole: "Senior ML Engineer, OpenAI",
      speakerAvatar: "/placeholder.svg",
      registered: 156,
      capacity: 200,
      description: "Learn how to transition into AI/ML roles from traditional software engineering. Covering skill gaps, portfolio building, and interview preparation.",
      tags: ["AI/ML", "Career", "Workshop"]
    },
    {
      id: 2,
      title: "Startup Fundraising Masterclass",
      type: "Webinar",
      date: "2024-02-18",
      time: "7:00 PM - 8:30 PM IST",
      mode: "Virtual",
      speaker: "Rajesh Sawhney",
      speakerRole: "Founder & CEO, InnerChef",
      speakerAvatar: "/placeholder.svg",
      registered: 89,
      capacity: 150,
      description: "From pre-seed to Series A - learn the complete fundraising journey, pitch deck essentials, and investor relations.",
      tags: ["Startup", "Fundraising", "Entrepreneurship"]
    },
    {
      id: 3,
      title: "Alumni Networking Mixer - Bangalore",
      type: "Networking",
      date: "2024-02-22",
      time: "6:30 PM - 9:00 PM IST", 
      mode: "In-Person",
      location: "UB City Mall, Bangalore",
      organizer: "Bangalore Alumni Chapter",
      registered: 45,
      capacity: 80,
      description: "Connect with alumni working in Bangalore. Food, drinks, and great conversations guaranteed!",
      tags: ["Networking", "Bangalore", "In-Person"]
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "System Design Deep Dive",
      type: "Workshop", 
      date: "2024-01-28",
      speaker: "Amit Singh",
      speakerRole: "Staff Engineer, Meta",
      participants: 180,
      recording: true,
      tags: ["System Design", "Engineering"]
    },
    {
      id: 5,
      title: "Product Management 101",
      type: "Webinar",
      date: "2024-01-15", 
      speaker: "Neha Chopra",
      speakerRole: "Senior PM, Flipkart",
      participants: 95,
      recording: true,
      tags: ["Product", "Management"]
    }
  ];

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
            <div className="flex gap-2">
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Host Event
              </Button>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="my-events">My Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3 space-y-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{event.type}</Badge>
                                {event.mode === "Virtual" ? (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Video className="w-3 h-3" />
                                    Virtual
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    In-Person
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {event.title}
                              </h3>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {event.time}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            )}
                          </div>

                          <p className="text-muted-foreground">{event.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="lg:w-1/3 space-y-4">
                          <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                            <Avatar>
                              <AvatarImage src={event.speakerAvatar} />
                              <AvatarFallback>
                                {event.speaker?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{event.speaker}</p>
                              <p className="text-xs text-muted-foreground">{event.speakerRole}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Registered:</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.registered}/{event.capacity}
                              </span>
                            </div>
                            
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-primary h-2 rounded-full" 
                                style={{width: `${(event.registered / event.capacity) * 100}%`}}
                              ></div>
                            </div>

                            <Button className="w-full">
                              Register Now
                            </Button>
                            
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{event.type}</Badge>
                          {event.recording && (
                            <Badge variant="outline" className="text-success">
                              Recording Available
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.speaker} • {event.speakerRole}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()} • {event.participants} participants
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {event.recording && (
                          <Button variant="outline" size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Watch Recording
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="my-events">
              <Card>
                <CardHeader>
                  <CardTitle>My Registered Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Events you've registered for will appear here.</p>
                  <Button>Browse Events</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Events;