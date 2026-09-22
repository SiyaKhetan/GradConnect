import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  Search as SearchIcon, 
  Filter, 
  User, 
  Building, 
  MapPin, 
  MessageCircle, 
  Calendar,
  Star
} from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    userType: '',
    company: '',
    role: '',
    batch: '',
    techStack: '',
    location: ''
  });

  // Mock alumni/student data
  const profiles = [
    {
      id: 1,
      name: "Sarah Chen",
      type: "Alumni",
      batch: "2018-2022",
      role: "Senior Software Engineer",
      company: "Google",
      location: "San Francisco, CA",
      skills: ["React", "Python", "Machine Learning", "System Design"],
      rating: 4.9,
      status: "Active",
      avatar: "SC",
      bio: "Passionate about ML and mentoring students in tech careers."
    },
    {
      id: 2,
      name: "Alex Kumar",
      type: "Alumni",
      batch: "2017-2021",
      role: "Product Manager",
      company: "Microsoft",
      location: "Seattle, WA",
      skills: ["Product Strategy", "Data Analysis", "Leadership", "Agile"],
      rating: 4.8,
      status: "Active",
      avatar: "AK",
      bio: "Helping students transition from engineering to product roles."
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      type: "Student",
      batch: "2021-2025",
      role: "Computer Science Student",
      company: "University",
      location: "Boston, MA",
      skills: ["JavaScript", "Node.js", "React", "MongoDB"],
      rating: 4.7,
      status: "Active",
      avatar: "MR",
      bio: "Final year student looking for SDE opportunities and mentorship."
    },
    {
      id: 4,
      name: "David Park",
      type: "Alumni",
      batch: "2016-2020",
      role: "Data Scientist",
      company: "Netflix",
      location: "Los Angeles, CA",
      skills: ["Python", "TensorFlow", "Statistics", "SQL"],
      rating: 4.6,
      status: "Occasionally Active",
      avatar: "DP",
      bio: "Data science mentor with 4 years of industry experience."
    },
    {
      id: 5,
      name: "Priya Sharma",
      type: "Student",
      batch: "2022-2026",
      role: "Engineering Student",
      company: "University",
      location: "Austin, TX",
      skills: ["Java", "Spring Boot", "Docker", "AWS"],
      rating: 4.5,
      status: "Active",
      avatar: "PS",
      bio: "Sophomore interested in cloud computing and backend development."
    }
  ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         profile.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = (!filters.userType || profile.type === filters.userType) &&
                          (!filters.company || profile.company.toLowerCase().includes(filters.company.toLowerCase())) &&
                          (!filters.batch || profile.batch === filters.batch);
    
    return matchesSearch && matchesFilters;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Occasionally Active': return 'status-occasional';
      case 'Inactive': return 'status-inactive';
      default: return 'status-inactive';
    }
  };

  const handleContact = (profile: any, type: 'chat' | 'meeting') => {
    console.log(`${type} with ${profile.name}`);
    // In real app would handle chat/meeting actions
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Discover Alumni & Students
              </h1>
              <p className="text-muted-foreground">
                Connect with mentors, peers, and build your professional network.
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="card-elevated mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SearchIcon className="w-5 h-5" />
                  <span>Search & Filter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, skills, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <Select value={filters.userType} onValueChange={(value) => setFilters({...filters, userType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                      <SelectItem value="Student">Students</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Company"
                    value={filters.company}
                    onChange={(e) => setFilters({...filters, company: e.target.value})}
                  />

                  <Select value={filters.batch} onValueChange={(value) => setFilters({...filters, batch: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2018-2022">2018-2022</SelectItem>
                      <SelectItem value="2017-2021">2017-2021</SelectItem>
                      <SelectItem value="2021-2025">2021-2025</SelectItem>
                      <SelectItem value="2022-2026">2022-2026</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Tech Stack"
                    value={filters.techStack}
                    onChange={(e) => setFilters({...filters, techStack: e.target.value})}
                  />

                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({userType: '', company: '', role: '', batch: '', techStack: '', location: ''})}
                    className="flex items-center space-x-2"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Clear</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Search Results ({filteredProfiles.length})
                </h2>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="recent">Recently Active</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="card-interactive group cursor-pointer" onClick={() => navigate(`/dashboard/profile/${profile.id}`)}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary-foreground">
                          {profile.avatar}
                        </span>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {profile.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{profile.type}</span>
                              <span>•</span>
                              <span>{profile.batch}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className={getStatusColor(profile.status)}>
                              {profile.status}
                            </span>
                          </div>
                        </div>

                        {/* Role & Company */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                          <Building className="w-4 h-4" />
                          <span>{profile.role} at {profile.company}</span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {profile.bio}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {profile.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-4">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          <span className="text-sm font-medium">{profile.rating}</span>
                          <span className="text-sm text-muted-foreground">(23 reviews)</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleContact(profile, 'chat')}
                            className="flex-1 btn-professional"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleContact(profile, 'meeting')}
                            className="flex-1 btn-professional"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProfiles.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No profiles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({userType: '', company: '', role: '', batch: '', techStack: '', location: ''});
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;