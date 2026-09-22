import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Medal,
  Star,
  Users,
  MessageCircle,
  Calendar,
  Heart,
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const leaderboardData = [
    {
      rank: 1,
      name: "Priya Sharma",
      avatar: "/placeholder.svg",
      batch: "2018", 
      company: "Meta",
      points: 2450,
      badges: ["Top Mentor", "Community Leader", "Event Host"],
      activities: {
        mentoringSessions: 15,
        communityPosts: 8,
        eventsHosted: 2,
        donationsTotal: 50000
      },
      trend: "up"
    },
    {
      rank: 2,
      name: "Arjun Patel", 
      avatar: "/placeholder.svg",
      batch: "2019",
      company: "Google",
      points: 2180,
      badges: ["Interview Master", "Tech Contributor"],
      activities: {
        mentoringSessions: 12,
        communityPosts: 15,
        eventsHosted: 1,
        donationsTotal: 30000
      },
      trend: "up"
    },
    {
      rank: 3,
      name: "Neha Singh",
      avatar: "/placeholder.svg", 
      batch: "2017",
      company: "Microsoft",
      points: 1950,
      badges: ["Generous Donor", "Networking Pro"],
      activities: {
        mentoringSessions: 8,
        communityPosts: 6,
        eventsHosted: 3,
        donationsTotal: 75000
      },
      trend: "down"
    },
    {
      rank: 4,
      name: "Rohit Kumar",
      avatar: "/placeholder.svg",
      batch: "2020", 
      company: "Amazon",
      points: 1720,
      badges: ["Rising Star", "Active Participant"],
      activities: {
        mentoringSessions: 10,
        communityPosts: 12,
        eventsHosted: 0,
        donationsTotal: 15000
      },
      trend: "up"
    },
    {
      rank: 5,
      name: "Ananya Gupta",
      avatar: "/placeholder.svg",
      batch: "2019",
      company: "Flipkart", 
      points: 1580,
      badges: ["Content Creator", "Helpful Alumni"],
      activities: {
        mentoringSessions: 7,
        communityPosts: 20,
        eventsHosted: 1,
        donationsTotal: 25000
      },
      trend: "stable"
    }
  ];

  const categories = [
    {
      title: "Top Mentors",
      icon: Users,
      description: "Alumni providing the most mentorship sessions",
      leaders: leaderboardData.slice(0, 3).map(p => ({
        ...p,
        score: p.activities.mentoringSessions,
        metric: "sessions"
      }))
    },
    {
      title: "Community Contributors", 
      icon: MessageCircle,
      description: "Most active in discussions and knowledge sharing",
      leaders: leaderboardData.slice(0, 3).map(p => ({
        ...p,
        score: p.activities.communityPosts,
        metric: "posts"
      }))
    },
    {
      title: "Event Organizers",
      icon: Calendar, 
      description: "Leading event organization and hosting",
      leaders: leaderboardData.slice(0, 3).map(p => ({
        ...p,
        score: p.activities.eventsHosted,
        metric: "events"
      }))
    },
    {
      title: "Top Donors",
      icon: Heart,
      description: "Highest contributions to alumni fund", 
      leaders: leaderboardData.slice(0, 3).map(p => ({
        ...p,
        score: p.activities.donationsTotal,
        metric: "₹"
      }))
    }
  ];

  const achievements = [
    { name: "First Mentor", description: "Complete your first mentoring session", icon: "🎯", rarity: "Common" },
    { name: "Community Leader", description: "Reach 100 community interactions", icon: "👑", rarity: "Rare" },
    { name: "Event Master", description: "Host 5 successful events", icon: "🎪", rarity: "Epic" },
    { name: "Generous Heart", description: "Donate ₹1,00,000+ to alumni fund", icon: "💎", rarity: "Legendary" },
    { name: "Knowledge Sharer", description: "Write 50+ helpful posts", icon: "📚", rarity: "Rare" },
    { name: "Interview Guru", description: "Help 25+ alumni with interview prep", icon: "🧠", rarity: "Epic" }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
              <p className="text-muted-foreground">Celebrating our most engaged and helpful alumni</p>
            </div>
            <div className="flex gap-2">
              {["week", "month", "quarter", "year"].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overall" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overall" className="space-y-6">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {leaderboardData.slice(0, 3).map((person, index) => (
                  <Card key={person.rank} className={`relative ${index === 0 ? 'md:order-2 bg-gradient-card' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
                    <CardContent className="p-6 text-center">
                      <div className="relative mb-4">
                        <Avatar className="w-20 h-20 mx-auto">
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index === 0 ? <Trophy className="w-5 h-5 text-white" /> : 
                           index === 1 ? <Medal className="w-5 h-5 text-white" /> :
                           <Medal className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.batch} • {person.company}</p>
                      <p className="text-2xl font-bold text-primary mt-2">{person.points} pts</p>
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {person.badges.slice(0, 2).map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Full Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Complete Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.map((person) => (
                      <div key={person.rank} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                            {person.rank}
                          </div>
                          <Avatar>
                            <AvatarImage src={person.avatar} />
                            <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{person.name}</h4>
                            <p className="text-sm text-muted-foreground">{person.batch} • {person.company}</p>
                          </div>
                          <div className="hidden sm:flex gap-1">
                            {person.badges.slice(0, 2).map((badge) => (
                              <Badge key={badge} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg">{person.points}</p>
                            <p className="text-xs text-muted-foreground">points</p>
                          </div>
                          <div className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            person.trend === 'up' ? 'bg-success/20' : 
                            person.trend === 'down' ? 'bg-destructive/20' : 'bg-muted'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${
                              person.trend === 'up' ? 'text-success' :
                              person.trend === 'down' ? 'text-destructive rotate-180' : 'text-muted-foreground'
                            }`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {categories.map((category) => (
                  <Card key={category.title}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <category.icon className="w-5 h-5" />
                        {category.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.leaders.map((leader, index) => (
                        <div key={leader.rank} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={leader.avatar} />
                              <AvatarFallback className="text-xs">
                                {leader.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{leader.name}</p>
                              <p className="text-xs text-muted-foreground">{leader.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {category.title === "Top Donors" ? 
                                `₹${(leader.score / 1000).toFixed(0)}K` : 
                                leader.score
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">{leader.metric}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Achievements</CardTitle>
                  <p className="text-muted-foreground">Unlock badges by contributing to the alumni community</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.name} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  achievement.rarity === 'Legendary' ? 'border-yellow-500 text-yellow-600' :
                                  achievement.rarity === 'Epic' ? 'border-purple-500 text-purple-600' :
                                  achievement.rarity === 'Rare' ? 'border-blue-500 text-blue-600' :
                                  'border-gray-500 text-gray-600'
                                }`}
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <Progress value={Math.floor(Math.random() * 100)} className="mt-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;