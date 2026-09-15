import { useEffect, useState } from "react";
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
  ArrowRight,
  User,
  Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService, DashboardStats, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [meData, statsData] = await Promise.all([
          apiService.getMe(),
          apiService.getDashboardStats(),
        ]);
        setMe(meData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [toast]);

  const statCards = stats ? [
    {
      title: "Connections Made",
      value: String(stats.connectionsMade),
      icon: Users,
      change: `${stats.connectionsMade} total`,
      color: "text-primary"
    },
    {
      title: "Messages",
      value: String(stats.unreadMessages),
      icon: MessageCircle,
      change: `${stats.unreadMessages} unread`,
      color: "text-secondary"
    },
    {
      title: "Meetings Scheduled",
      value: String(stats.meetingsScheduled),
      icon: Calendar,
      change: stats.nextMeeting ? `Next: ${stats.nextMeeting.date} ${stats.nextMeeting.time}` : "None scheduled",
      color: "text-success"
    },
    {
      title: "Feedback Score",
      value: stats.feedbackCount ? stats.feedbackScore.toFixed(1) : "—",
      icon: Star,
      change: `Based on ${stats.feedbackCount} reviews`,
      color: "text-warning"
    }
  ] : [];

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

  const activityIcon = (type: string) => {
    if (type === 'message') return MessageCircle;
    if (type === 'meeting') return Calendar;
    return Star;
  };

  const timeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
                Welcome back, {me?.firstName || 'there'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your alumni network today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
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
                  {!stats || stats.recentActivity.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity yet</p>
                  ) : (
                    stats.recentActivity.map((activity, index) => {
                      const Icon = activityIcon(activity.type);
                      return (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/30 transition-colors">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {timeAgo(activity.time)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
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
                  {stats && stats.upcomingMeetings.length > 0 ? (
                    stats.upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{meeting.with} - {meeting.topic}</h4>
                            <p className="text-sm text-muted-foreground">{meeting.date}, {meeting.time} · {meeting.status}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm">No more meetings scheduled</p>
                      <Button variant="link" onClick={() => navigate('/dashboard/meetings')}>
                        Schedule a new meeting
                      </Button>
                    </div>
                  )}
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
