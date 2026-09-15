import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Upload, Plus, X, Building, User, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APIService } from "@/lib/api";

const ProfileSetup = () => {
  const [userType, setUserType] = useState<'alumni' | 'student'>('alumni');
  const [skills, setSkills] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNo: '',
    batch: '',
    company: '',
    role: '',
    experience: '',
    goals: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addTechStack = () => {
    if (newSkill.trim() && !techStack.includes(newSkill.trim())) {
      setTechStack([...techStack, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeTechStack = (techToRemove: string) => {
    setTechStack(techStack.filter(tech => tech !== techToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const profileData = {
        userType,
        name: formData.name,
        enrollmentNo: formData.enrollmentNo,
        batch: formData.batch,
        ...(userType === 'alumni' && {
          company: formData.company,
          role: formData.role,
          experience: formData.experience,
          skills
        }),
        ...(userType === 'student' && {
          techStack,
          goals: formData.goals
        })
      };

      await APIService.updateProfile(profileData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Data Science',
    'Product Management', 'Marketing', 'Sales', 'Finance', 'Leadership', 'Communication'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary-light p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GradConnect
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help others discover and connect with you</p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {userType === 'alumni' ? <Building className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              <span>{userType === 'alumni' ? 'Alumni Profile' : 'Student Profile'}</span>
            </CardTitle>
            <CardDescription>
              {userType === 'alumni' 
                ? 'Share your professional journey to mentor students'
                : 'Tell us about your academic journey and career goals'
              }
            </CardDescription>
            
            {/* User Type Toggle */}
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'alumni' | 'student')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="alumni">Alumni</TabsTrigger>
                <TabsTrigger value="student">Student</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Basic Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enrollment">Enrollment Number *</Label>
                    <Input 
                      id="enrollment"
                      value={formData.enrollmentNo}
                      onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                      placeholder="e.g., 2020B1234567G" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch">Batch *</Label>
                  <Input 
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => handleInputChange('batch', e.target.value)}
                    placeholder="e.g., 2020-2024" 
                    required 
                  />
                </div>
              </div>

              {/* Career Details (Alumni) */}
              {userType === 'alumni' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Career Information</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Current Company</Label>
                      <Input 
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="e.g., Google, Microsoft" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Current Role</Label>
                      <Input 
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        placeholder="e.g., Software Engineer, Product Manager" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 3 years" 
                    />
                  </div>

                  {/* Skills for Alumni */}
                  <div className="space-y-2">
                    <Label>Professional Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {suggestedSkills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs"
                          onClick={() => !skills.includes(skill) && setSkills([...skills, skill])}
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Student-specific fields */}
              {userType === 'student' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Academic & Career Information</span>
                  </h3>

                  {/* Tech Stack for Students */}
                  <div className="space-y-2">
                    <Label>Tech Stack & Interests</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{tech}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeTechStack(tech)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add technology or interest..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                      />
                      <Button type="button" onClick={addTechStack} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">Future Goals & Aspirations</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      placeholder="What are your career goals? What kind of mentorship are you looking for?"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Document Upload</span>
                </h3>
                
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your {userType === 'alumni' ? 'transcript or resume' : 'student ID or transcript'}
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>

              {/* LinkedIn Integration */}
              <div className="p-4 bg-primary-light rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-primary">LinkedIn Integration</h4>
                    <p className="text-sm text-primary/70">Auto-fill your profile from LinkedIn</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect LinkedIn
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/auth')}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 btn-professional bg-gradient-primary hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Complete Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;