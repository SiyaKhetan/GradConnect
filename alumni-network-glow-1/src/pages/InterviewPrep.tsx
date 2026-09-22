import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  ThumbsUp,
  MessageCircle,
  Star,
  Filter,
  TrendingUp,
  BookOpen,
  Users,
  Building,
  Clock
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

const InterviewPrep = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");

  const companies = ["All Companies", "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix"];
  
  const interviewExperiences = [
    {
      id: 1,
      title: "Google L4 SWE Interview Experience - 5 Rounds",
      author: "Arjun Patel",
      authorBatch: "2020",
      company: "Google",
      role: "Software Engineer L4",
      result: "Selected",
      difficulty: "Hard",
      rounds: 5,
      date: "Jan 2024",
      upvotes: 45,
      comments: 12,
      tags: ["coding", "system-design", "behavioral"],
      preview: "Detailed breakdown of my Google interview process including preparation strategy, questions asked in each round, and key learnings..."
    },
    {
      id: 2, 
      title: "Microsoft Product Manager Interview - What to Expect",
      author: "Priya Singh",
      authorBatch: "2019",
      company: "Microsoft", 
      role: "Product Manager",
      result: "Selected",
      difficulty: "Medium",
      rounds: 4,
      date: "Dec 2023",
      upvotes: 38,
      comments: 8,
      tags: ["product-management", "case-study", "behavioral"],
      preview: "My experience interviewing for PM role at Microsoft. Covers case studies, product sense questions, and stakeholder management scenarios..."
    },
    {
      id: 3,
      title: "Amazon SDE-2 Virtual Interview Process",
      author: "Rohit Kumar",
      authorBatch: "2018", 
      company: "Amazon",
      role: "SDE-2",
      result: "Not Selected",
      difficulty: "Hard",
      rounds: 4,
      date: "Nov 2023",
      upvotes: 29,
      comments: 15,
      tags: ["coding", "leadership-principles", "system-design"],
      preview: "Honest review of my Amazon interview experience. What went wrong, feedback received, and how I'm preparing for the next attempt..."
    }
  ];

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

  const filteredExperiences = interviewExperiences.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompany === "all" || selectedCompany === "All Companies" || 
                          exp.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

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
            <Button className="bg-gradient-primary hover:opacity-90">
              <BookOpen className="w-4 h-4 mr-2" />
              Share Experience
            </Button>
          </div>

          <Tabs defaultValue="experiences" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="mock-interviews">Mock Interviews</TabsTrigger>
              <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="experiences" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by company, role, or keywords..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {companies.map((company) => (
                    <Badge 
                      key={company}
                      variant={selectedCompany === company ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setSelectedCompany(company)}
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interview Experiences */}
              <div className="space-y-4">
                {filteredExperiences.map((experience) => (
                  <Card key={experience.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary">
                              {experience.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {experience.author.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{experience.author}</span>
                                <Badge variant="outline" className="text-xs">
                                  {experience.authorBatch}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {experience.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {experience.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Badge 
                              variant={experience.result === "Selected" ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {experience.result}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {experience.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {experience.preview}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {experience.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {experience.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {experience.comments} comments
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {experience.rounds} rounds
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            Read Full Experience
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {preparationResources.map((category) => (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle>{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {category.resources.map((resource) => (
                        <div key={resource.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">{resource.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-current text-yellow-500" />
                              <span className="text-sm">{resource.rating}</span>
                            </div>
                            <Button size="sm" variant="outline">View</Button>
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
                <CardHeader>
                  <CardTitle>Mock Interview Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Practice with alumni who work at top companies</p>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Users className="w-4 h-4 mr-2" />
                    Find Mock Interview Partner
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="study-groups">
              <Card>
                <CardHeader>
                  <CardTitle>Study Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Join or create study groups for focused preparation</p>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <Users className="w-4 h-4 mr-2" />
                    Join Study Group
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