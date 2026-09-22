import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Star,
  MessageCircle,
  Calendar,
  Heart,
  Loader
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiService, LeaderboardEntry } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Leaderboard = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiService.getLeaderboard()
      .then(setRows)
      .catch((error) => {
        console.error('Error loading leaderboard:', error);
        toast({ title: "Error", description: "Failed to load leaderboard", variant: "destructive" });
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center"><Loader className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground">
              Ranked by real activity: feedback received, completed mentorship sessions, community posts, and donations
            </p>
          </div>

          {rows.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No activity yet. Rankings will appear as people give feedback, complete meetings, post in the community, or donate.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Top 3 Podium */}
              {rows.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {rows.slice(0, 3).map((person, index) => (
                    <Card key={person.userId} className={`relative ${index === 0 ? 'md:order-2 bg-gradient-card' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                      <CardContent className="p-6 text-center">
                        <div className="relative mb-4">
                          <Avatar className="w-20 h-20 mx-auto">
                            <AvatarFallback>{initials(person.name)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index === 0 ? <Trophy className="w-5 h-5 text-white" /> : <Medal className="w-5 h-5 text-white" />}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">{person.batch} • {person.company || person.userType}</p>
                        <p className="text-2xl font-bold text-primary mt-2">{person.points} pts</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Full Leaderboard */}
              <Card>
                <CardHeader><CardTitle>Complete Rankings</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rows.map((person) => (
                      <div key={person.userId} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors flex-wrap gap-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">{person.rank}</div>
                          <Avatar><AvatarFallback>{initials(person.name)}</AvatarFallback></Avatar>
                          <div>
                            <h4 className="font-semibold">{person.name}</h4>
                            <p className="text-sm text-muted-foreground">{person.batch} • {person.company || person.userType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="w-4 h-4" />{person.feedbackReceived}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{person.meetingsCompleted}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{person.communityPosts}</span>
                          {person.donationsTotal > 0 && <span className="flex items-center gap-1"><Heart className="w-4 h-4" />₹{person.donationsTotal.toLocaleString()}</span>}
                          <Badge variant="secondary" className="text-base font-bold">{person.points} pts</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
