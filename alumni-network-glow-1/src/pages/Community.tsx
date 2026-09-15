import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  ThumbsUp,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Loader
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiService, Post, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = ["Career Tips", "Interview Experiences", "Tech Discussions", "Job Opportunities", "Collaboration"];

const Community = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Career Tips");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [me, setMe] = useState<UserProfile | null>(null);

  const fetchPosts = async () => {
    try {
      const data = await apiService.listPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({ title: "Error", description: "Failed to load discussions", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    apiService.getMe().then(setMe).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setIsPosting(true);
    try {
      const title = newPost.trim().split('\n')[0].slice(0, 100);
      await apiService.createPost({ title, content: newPost.trim(), category: newPostCategory });
      setNewPost("");
      toast({ title: "Posted", description: "Your discussion is live" });
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to post", variant: "destructive" });
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await apiService.togglePostLike(postId);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: result.likes, likedByMe: result.likedByMe } : p));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const timeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredPosts = posts.filter((p) =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <Input placeholder="Search discussions..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={newPostCategory === category ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setNewPostCategory(category)}
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
                      <AvatarFallback>{me ? initials(me.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Share your experience, ask questions, or start a discussion..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                        disabled={isPosting}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Posting to: {newPostCategory}</span>
                        <Button size="sm" onClick={handlePost} disabled={isPosting || !newPost.trim()}>
                          {isPosting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                          Post Discussion
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Discussion Posts */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No discussions yet — be the first to post!</p>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{post.author ? initials(post.author.name) : '?'}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{post.author?.name || 'Unknown'}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {post.author?.batch || '—'} • {post.author?.company || '—'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {timeAgo(post.createdAt)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-lg font-medium text-foreground hover:text-primary">
                                {post.title}
                              </h4>
                              <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                            </div>

                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={post.likedByMe ? "text-primary" : "text-muted-foreground hover:text-primary"}
                                  onClick={() => handleLike(post.id)}
                                >
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {post.likes}
                                </Button>
                                <span className="flex items-center text-sm text-muted-foreground">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  {post.commentCount} replies
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...posts].sort((a, b) => b.likes - a.likes).slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="font-medium text-sm">{post.title}</span>
                      <span className="text-sm text-muted-foreground">{post.likes} likes</span>
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-muted-foreground">No discussions yet.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="following">
              <Card>
                <CardHeader>
                  <CardTitle>Following</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Follow discussion authors from their profile to see their posts here.</p>
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
