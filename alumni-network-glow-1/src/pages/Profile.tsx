import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Building, Star, Loader } from "lucide-react";
import { apiService, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getMe()
      .then(setProfile)
      .catch((error) => {
        console.error('Error loading profile:', error);
        toast({ title: "Error", description: "Failed to load your profile", variant: "destructive" });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center"><Loader className="w-6 h-6 animate-spin text-muted-foreground" /></div>
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
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">View and manage your profile details.</p>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Overview</span>
                </CardTitle>
                <CardDescription>Basic info and skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground text-sm capitalize">{profile.userType} {profile.profile.batch ? `• ${profile.profile.batch}` : ''}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {initials(profile.name)}
                  </div>
                </div>

                {(profile.profile.role || profile.profile.company) && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
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

                {profile.profile.goals && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Goals: </span>{profile.profile.goals}
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" onClick={() => navigate('/profile-setup')}>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
