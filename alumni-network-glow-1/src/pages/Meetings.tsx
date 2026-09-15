import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";

const Meetings = () => {
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
                    <span>Calendar</span>
                  </CardTitle>
                  <CardDescription>Monthly/weekly simplified view (placeholder)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div key={i} className="h-20 border border-border rounded-md bg-card/40" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Schedule a Meeting</span>
                  </CardTitle>
                  <CardDescription>Pick date and time and request meeting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Time</label>
                    <Input type="time" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">Topic</label>
                    <Input placeholder="e.g., Resume review, Mock interview" />
                  </div>
                  <Button className="w-full btn-professional bg-gradient-primary hover:opacity-90">
                    <Check className="w-4 h-4 mr-2" />
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


