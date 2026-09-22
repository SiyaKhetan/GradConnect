import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Search,
  ThumbsUp,
  Star,
  BookOpen,
  Users,
  Building,
  Clock,
  Loader
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { apiService, InterviewExperience } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const preparationResources = [
  {
    category: "Coding Practice",
    resources: [
      { name: "LeetCode Premium", type: "Platform", rating: 4.8 },
      { name: "Cracking the Coding Interview", type: "Book", rating: 4.7 },
      { name: "AlgoExpert", type: "Course", rating: 4.6 }
    ]
  },
  {
    category: "System Design",
    resources: [
      { name: "Designing Data-Intensive Applications", type: "Book", rating: 4.9 },
      { name: "System Design Primer", type: "GitHub", rating: 4.8 },
      { name: "Grokking System Design", type: "Course", rating: 4.5 }
    ]
  }
];

const InterviewPrep = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', role: '', result: 'Selected' as 'Selected' | 'Not Selected',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard', rounds: '1', content: '',
  });

  const fetchExperiences = async (search?: string) => {
    try {
      const data = await apiService.listInterviewExperiences({ search });
      setExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast({ title: "Error", description: "Failed to load interview experiences", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchExperiences(searchQuery || undefined), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.company.trim() || !form.role.trim() || !form.content.trim()) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.createInterviewExperience({ ...form, rounds: Number(form.rounds) || 1 });
      toast({ title: "Success", description: "Experience shared" });
      setForm({ title: '', company: '', role: '', result: 'Selected', difficulty: 'Medium', rounds: '1', content: '' });
      setIsCreateOpen(false);
      fetchExperiences();
    } catch (error) {
      console.error('Error sharing experience:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to share experience", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    try {
      const result = await apiService.toggleUpvote(id);
      setExperiences((prev) => prev.map((e) => e.id === id ? { ...e, upvotes: result.upvotes, upvotedByMe: result.upvotedByMe } : e));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Interview Preparation</h1>
              <p className="text-muted-foreground">Learn from real interview experiences and prepare effectively</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:opacity-90">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Share Experience
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Share Your Interview Experience</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Title (e.g. Google L4 SWE Interview)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Select value={form.result} onValueChange={(v: 'Selected' | 'Not Selected') => setForm({ ...form, result: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Not Selected">Not Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={form.difficulty} onValueChange={(v: 'Easy' | 'Medium' | 'Hard') => setForm({ ...form, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Rounds" value={form.rounds} onChange={(e) => setForm({ ...form, rounds: e.target.value })} />
                  </div>
                  <Textarea placeholder="Share the details of your interview experience..." className="min-h-[120px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  <Button className="w-full" onClick={handleCreate} disabled={isSubmitting}>
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    Post Experience
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="experiences" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="mock-interviews">Mock Interviews</TabsTrigger>
              <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="experiences" className="space-y-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company, role, or keywords..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : experiences.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No experiences shared yet — be the first!</p>
              ) : (
                <div className="space-y-4">
                  {experiences.map((experience) => (
                    <Card key={experience.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <h3 className="text-lg font-semibold text-foreground hover:text-primary">{experience.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6"><AvatarFallback className="text-xs">{experience.author?.name.split(' ').map((n) => n[0]).join('') || '?'}</AvatarFallback></Avatar>
                                  <span>{experience.author?.name || 'Unknown'}</span>
                                  {experience.author?.batch && <Badge variant="outline" className="text-xs">{experience.author.batch}</Badge>}
                                </div>
                                <div className="flex items-center gap-1"><Building className="w-3 h-3" />{experience.company}</div>
                                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(experience.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Badge variant={experience.result === "Selected" ? "default" : "destructive"} className="text-xs">{experience.result}</Badge>
                              <Badge variant="outline" className="text-xs">{experience.difficulty}</Badge>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-2">{experience.content}</p>

                          {experience.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {experience.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={experience.upvotedByMe ? "text-primary" : "text-muted-foreground hover:text-primary"}
                                onClick={() => handleUpvote(experience.id)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {experience.upvotes}
                              </Button>
                              <span className="text-sm text-muted-foreground">{experience.rounds} rounds</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {preparationResources.map((category) => (
                  <Card key={category.category}>
                    <CardHeader><CardTitle>{category.category}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {category.resources.map((resource) => (
                        <div key={resource.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">{resource.type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span className="text-sm">{resource.rating}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mock-interviews">
              <Card>
                <CardHeader><CardTitle>Mock Interview Sessions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Reach out to alumni directly from Search to arrange a mock interview session.</p>
                  <Button className="bg-gradient-primary hover:opacity-90" onClick={() => window.location.assign('/dashboard/search')}>
                    <Users className="w-4 h-4 mr-2" />
                    Find a Mock Interview Partner
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="study-groups">
              <Card>
                <CardHeader><CardTitle>Study Groups</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Start a discussion in Community to organize a study group.</p>
                  <Button className="bg-gradient-primary hover:opacity-90" onClick={() => window.location.assign('/dashboard/community')}>
                    <Users className="w-4 h-4 mr-2" />
                    Go to Community
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InterviewPrep;
