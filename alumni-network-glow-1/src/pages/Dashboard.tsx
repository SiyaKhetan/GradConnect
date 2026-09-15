import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Connections Made",
      value: "12",
      icon: Users,
      change: "+3 this week",
      color: "text-primary"
    },
    {
      title: "Messages",
      value: "8",
      icon: MessageCircle,
      change: "4 unread",
      color: "text-secondary"
    },
    {
      title: "Meetings Scheduled",
      value: "3",
      icon: Calendar,
      change: "Next: Tomorrow 2 PM",
      color: "text-success"
    },
    {
      title: "Feedback Score",
      value: "4.8",
      icon: Star,
      change: "Based on 15 reviews",
      color: "text-warning"
    }
  ];

  const quickActions = [
    {
      title: "Find Alumni",
      description: "Search and connect with alumni in your field",
      icon: Users,
      action: () => navigate('/dashboard/search'),
      color: "bg-primary"
    },
    {
      title: "Start Conversation",
      description: "Send a message to your connections",
      icon: MessageCircle,
      action: () => navigate('/dashboard/chat'),
      color: "bg-secondary"
    },
    {
      title: "Schedule Meeting",
      description: "Book a mentorship session",
      icon: Calendar,
      action: () => navigate('/dashboard/meetings'),
      color: "bg-success"
    }
  ];

  const recentActivity = [
    {
      type: "message",
      title: "New message from Sarah Chen",
      description: "Thanks for the career advice! Would love to...",
      time: "2 hours ago",
      icon: MessageCircle
    },
    {
      type: "meeting",
      title: "Meeting scheduled with Alex Kumar",
      description: "Tomorrow at 2:00 PM - Product Management discussion",
      time: "1 day ago",
      icon: Calendar
    },
    {
      type: "feedback",
      title: "New feedback received",
      description: "5-star rating from Maria Rodriguez",
      time: "2 days ago",
      icon: Star
    },
    {
      type: "connection",
      title: "New connection request",
      description: "David Park wants to connect with you",
      time: "3 days ago",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, John! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your alumni network today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <div className="flex items-baseline space-x-2">
                          <h3 className="text-2xl font-bold text-foreground">
                            {stat.value}
                          </h3>
                        </div>
                        <p className={cn("text-xs mt-1", stat.color)}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={cn("p-3 rounded-lg", stat.color.replace('text-', 'bg-').replace('primary', 'primary/10').replace('secondary', 'secondary/10').replace('success', 'success/10').replace('warning', 'warning/10'))}>
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>
                    Get started with these common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors group"
                      onClick={action.action}
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", action.color)}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Stay updated with your latest interactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Meetings */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Upcoming Meetings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">Alex Kumar - Product Management Chat</h4>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM - 3:00 PM</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Join Meeting
                    </Button>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">No more meetings scheduled</p>
                    <Button variant="link" onClick={() => navigate('/dashboard/meetings')}>
                      Schedule a new meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default Dashboard;