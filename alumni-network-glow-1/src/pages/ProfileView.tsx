import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Star, Loader } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiService.getUserById(id)
      .then(setProfile)
      .catch((error) => {
        console.error('Error loading profile:', error);
        toast({ title: "Error", description: "Failed to load this profile", variant: "destructive" });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center"><Loader className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Profile not found.</div>
      </div>
    );
  }

  const skills = [...(profile.profile.skills || []), ...(profile.profile.techStack || [])];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{profile.name}</h1>
                <p className="text-muted-foreground capitalize">{profile.userType} {profile.profile.batch ? `• ${profile.profile.batch}` : ''}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {initials(profile.name)}
              </div>
            </div>

            <Card className="card-elevated">
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(profile.profile.role || profile.profile.company) && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{profile.profile.role || 'N/A'} at {profile.profile.company || 'N/A'}</span>
                  </div>
                )}
                {profile.rating !== null && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="text-sm font-medium">{profile.rating}</span>
                    <span className="text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
                  </div>
                )}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={() => navigate('/dashboard/chat', { state: { userId: profile.id } })} className="btn-professional">
                    <MessageCircle className="w-4 h-4 mr-2" /> Chat
                  </Button>
                  <Button onClick={() => navigate('/dashboard/meetings', { state: { userId: profile.id } })} variant="outline" className="btn-professional">
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
