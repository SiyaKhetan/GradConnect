import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Search, 
  MessageCircle, 
  Calendar, 
  Star, 
  LogOut, 
  GraduationCap,
  Menu,
  X,
  Users,
  Trophy,
  Heart,
  BookOpen,
  Video
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Search, label: "Search Alumni", path: "/dashboard/search" },
    { icon: MessageCircle, label: "Messages", path: "/dashboard/chat" },
    { icon: Calendar, label: "Meetings", path: "/dashboard/meetings" },
    { icon: Star, label: "Feedback", path: "/dashboard/feedback" },
    { icon: Users, label: "Community", path: "/dashboard/community" },
    { icon: Video, label: "Events", path: "/dashboard/events" },
    { icon: BookOpen, label: "Interview Prep", path: "/dashboard/interview-prep" },
    { icon: Trophy, label: "Leaderboard", path: "/dashboard/leaderboard" },
    { icon: Heart, label: "Fundraising", path: "/dashboard/fundraising" },
  ];

  const handleLogout = () => {
    // Mock logout - in real app would handle session cleanup
    navigate('/');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        isCollapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b border-border">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GradConnect
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  )
                }
                onClick={() => setIsCollapsed(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Alumni • 2020</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;