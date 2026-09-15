import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Placeholder: in real app fetch by id
  const profile = {
    id,
    name: "Sarah Chen",
    type: "Alumni",
    batch: "2018-2022",
    role: "Senior Software Engineer",
    company: "Google",
    skills: ["React", "Python", "Machine Learning", "System Design"],
    rating: 4.9,
    status: "Active",
    bio: "Passionate about ML and mentoring students in tech careers.",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.type} • {profile.batch}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                SC
              </div>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-muted-foreground">{profile.bio}</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{profile.role} at {profile.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="text-sm font-medium">{profile.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
                <div className="flex space-x-3 pt-2">
                  <Button onClick={() => navigate('/dashboard/chat')} className="btn-professional">
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat
                  </Button>
                  <Button onClick={() => navigate('/dashboard/meetings')} variant="outline" className="btn-professional">
                    <Calendar className="w-4 h-4 mr-2" /> Schedule Meeting
                  </Button>
                  <Button onClick={() => navigate('/dashboard/feedback')} variant="outline" className="btn-professional">
                    <Star className="w-4 h-4 mr-2" /> Leave Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;


