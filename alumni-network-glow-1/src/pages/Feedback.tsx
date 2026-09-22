import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, FeedbackItem, UserForFeedback } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [feedbackType, setFeedbackType] = useState<'meeting' | 'chat' | 'general'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [givenFeedback, setGivenFeedback] = useState<FeedbackItem[]>([]);
  const [receivedFeedback, setReceivedFeedback] = useState<FeedbackItem[]>([]);
  const [isLoadingGiven, setIsLoadingGiven] = useState(true);
  const [isLoadingReceived, setIsLoadingReceived] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<UserForFeedback[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const { toast } = useToast();

  // Mock users for demo - in real app, fetch from API
  const mockUsers = [
    { id: "69db67db15c3ad68a2d5be71", name: "Maria Rodriguez" },
    { id: "69db67db15c3ad68a2d5be73", name: "Alex Kumar" },
    { id: "69db67db15c3ad68a2d5be75", name: "Sarah Johnson" },
    { id: "69db67dc15c3ad68a2d5be77", name: "David Chen" }
  ];

  useEffect(() => {
    fetchFeedbackHistory();
    fetchAvailableUsers();
  }, []);

  const fetchFeedbackHistory = async () => {
    try {
      const [given, received] = await Promise.all([
        apiService.getGivenFeedback(),
        apiService.getReceivedFeedback()
      ]);
      setGivenFeedback(given);
      setReceivedFeedback(received);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGiven(false);
      setIsLoadingReceived(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const users = await apiService.getUsersForFeedback();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users for feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || rating === 0 || !comment.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.submitFeedback({
        toUserId: selectedUser,
        rating,
        comment: comment.trim(),
        feedbackType
      });

      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
      });

      // Reset form
      setRating(0);
      setComment("");
      setSelectedUser("");
      setFeedbackType('general');

      // Refresh feedback history
      await fetchFeedbackHistory();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 md:ml-0 ml-0">
          <div className="p-6 md:p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Feedback</h1>
              <p className="text-muted-foreground">Rate your interactions and view your feedback history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 card-elevated">
                <CardHeader>
                  <CardTitle>Leave Feedback</CardTitle>
                  <CardDescription>Rate from 1–5 stars and add a comment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select User</label>
                    <Select value={selectedUser} onValueChange={setSelectedUser} disabled={isLoadingUsers}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Choose who to give feedback to"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback Type</label>
                    <Select value={feedbackType} onValueChange={(value: 'meeting' | 'chat' | 'general') => setFeedbackType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="chat">Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rating</label>
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button key={i} onClick={() => setRating(i + 1)} className="focus:outline-none">
                          <Star className={`w-6 h-6 ${i < rating ? 'text-warning fill-current' : 'text-muted-foreground'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Comment</label>
                    <Textarea
                      rows={4}
                      placeholder="Share your feedback..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="btn-professional bg-gradient-primary hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>History</CardTitle>
                  <CardDescription>Given and received feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Given</h4>
                    <div className="space-y-2">
                      {isLoadingGiven ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader className="w-4 h-4 animate-spin" />
                        </div>
                      ) : givenFeedback.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No feedback given yet</p>
                      ) : (
                        givenFeedback.map((f) => (
                          <div key={f.id} className="p-3 rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{f.toUser?.name}</span>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: f.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-warning fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{f.comment}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground capitalize">{f.feedbackType}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Received</h4>
                    <div className="space-y-2">
                      {isLoadingReceived ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader className="w-4 h-4 animate-spin" />
                        </div>
                      ) : receivedFeedback.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No feedback received yet</p>
                      ) : (
                        receivedFeedback.map((f) => (
                          <div key={f.id} className="p-3 rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{f.fromUser?.name}</span>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: f.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-warning fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{f.comment}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground capitalize">{f.feedbackType}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(f.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;


