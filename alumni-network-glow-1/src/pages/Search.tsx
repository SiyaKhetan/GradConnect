import { useEffect, useState } from "react";
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
  Building,
  MessageCircle,
  Calendar,
  Star,
  Loader
} from "lucide-react";
import { apiService, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    userType: '',
    company: '',
    batch: '',
  });
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const results = await apiService.listUsers({
        search: searchQuery || undefined,
        userType: filters.userType || undefined,
        company: filters.company || undefined,
        batch: filters.batch || undefined,
      });
      setProfiles(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProfiles, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleContact = (profile: UserProfile, type: 'chat' | 'meeting') => {
    if (type === 'chat') {
      navigate('/dashboard/chat', { state: { userId: profile.id } });
    } else {
      navigate('/dashboard/meetings', { state: { userId: profile.id } });
    }
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Select value={filters.userType || 'all'} onValueChange={(value) => setFilters({ ...filters, userType: value === 'all' ? '' : value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Company"
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                  />

                  <Input
                    placeholder="Batch"
                    value={filters.batch}
                    onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                  />

                  <Button
                    variant="outline"
                    onClick={() => { setSearchQuery(''); setFilters({ userType: '', company: '', batch: '' }); }}
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
              <h2 className="text-xl font-semibold text-foreground">
                Search Results ({profiles.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Profile Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {profiles.map((profile) => (
                    <Card key={profile.id} className="card-interactive group cursor-pointer" onClick={() => navigate(`/dashboard/profile/${profile.id}`)}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Avatar */}
                          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-primary-foreground">
                              {initials(profile.name)}
                            </span>
                          </div>

                          {/* Profile Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {profile.name}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground capitalize">
                                  <span>{profile.userType}</span>
                                  {profile.profile.batch && <><span>•</span><span>{profile.profile.batch}</span></>}
                                </div>
                              </div>
                            </div>

                            {/* Role & Company */}
                            {(profile.profile.role || profile.profile.company) && (
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                <Building className="w-4 h-4" />
                                <span>{profile.profile.role || 'N/A'} at {profile.profile.company || 'N/A'}</span>
                              </div>
                            )}

                            {/* Skills */}
                            {(profile.profile.skills?.length || profile.profile.techStack?.length) ? (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {[...(profile.profile.skills || []), ...(profile.profile.techStack || [])].slice(0, 4).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            ) : null}

                            {/* Rating */}
                            {profile.rating !== null && (
                              <div className="flex items-center space-x-1 mb-4">
                                <Star className="w-4 h-4 text-warning fill-current" />
                                <span className="text-sm font-medium">{profile.rating}</span>
                                <span className="text-sm text-muted-foreground">({profile.reviewCount} reviews)</span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleContact(profile, 'chat'); }}
                                className="flex-1 btn-professional"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); handleContact(profile, 'meeting'); }}
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
                {profiles.length === 0 && (
                  <div className="text-center py-12">
                    <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No profiles found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => { setSearchQuery(''); setFilters({ userType: '', company: '', batch: '' }); }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
