import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Plus,
  Search,
  TrendingUp,
  Clock
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "All Discussions",
    "Career Tips",
    "Interview Experiences", 
    "Tech Discussions",
    "Job Opportunities",
    "Collaboration"
  ];

  const posts = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "/placeholder.svg",
      batch: "2019",
      company: "Google",
      title: "My Journey from Student to Senior SWE at Google",
      content: "Sharing my 4-year journey and key learnings that helped me grow...",
      category: "Career Tips",
      likes: 24,
      replies: 8,
      timeAgo: "2 hours ago",
      tags: ["career-growth", "google", "software-engineering"]
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      avatar: "/placeholder.svg", 
      batch: "2020",
      company: "Microsoft",
      title: "System Design Interview at FAANG - Complete Guide",
      content: "Recently cleared system design rounds at multiple FAANG companies...",
      category: "Interview Experiences",
      likes: 45,
      replies: 15,
      timeAgo: "5 hours ago",
      tags: ["system-design", "interview", "faang"]
    },
    {
      id: 3,
      author: "Priya Sharma",
      avatar: "/placeholder.svg",
      batch: "2018",
      company: "Startup Founder",
      title: "Looking for Co-founder with Backend expertise",
      content: "Building an EdTech platform. Looking for someone passionate about education...",
      category: "Collaboration", 
      likes: 12,
      replies: 6,
      timeAgo: "1 day ago",
      tags: ["startup", "co-founder", "edtech"]
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community Discussions</h1>
              <p className="text-muted-foreground">Connect, share, and learn from fellow alumni</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>

          <Tabs defaultValue="discussions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discussions">All Discussions</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search discussions..." className="pl-10" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.slice(1).map((category) => (
                    <Badge 
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Create New Post */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea 
                        placeholder="Share your experience, ask questions, or start a discussion..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {["career-tips", "interview", "tech"].map((tag) => (
                            <Badge key={tag} variant="outline" className="cursor-pointer">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm">Post Discussion</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Discussion Posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{post.author}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {post.batch} • {post.company}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {post.timeAgo}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="text-lg font-medium text-foreground hover:text-primary">
                              {post.title}
                            </h4>
                            <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.replies} replies
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Most popular discussions this week will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following">
              <Card>
                <CardHeader>
                  <CardTitle>Following</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Discussions from people you follow will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Community;