import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  MessageCircle, 
  Send, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Paperclip
} from "lucide-react";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  // Mock chat conversations
  const conversations = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      lastMessage: "Thanks for the career advice! Would love to schedule a follow-up meeting.",
      timestamp: "2 hours ago",
      unread: 2,
      status: "online"
    },
    {
      id: 2,
      name: "Alex Kumar",
      avatar: "AK",
      lastMessage: "The product management resources you shared were really helpful.",
      timestamp: "1 day ago",
      unread: 0,
      status: "offline"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      avatar: "MR",
      lastMessage: "Looking forward to our mentorship session next week!",
      timestamp: "2 days ago",
      unread: 1,
      status: "online"
    },
    {
      id: 4,
      name: "David Park",
      avatar: "DP",
      lastMessage: "Could you review my data science project?",
      timestamp: "3 days ago",
      unread: 0,
      status: "away"
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hi John! I hope you're doing well. I wanted to thank you for connecting with me.",
      timestamp: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      content: "Hello Sarah! It's great to connect with you. I saw your profile and I'm impressed with your academic achievements.",
      timestamp: "10:35 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "Thank you! I'm really interested in transitioning into the tech industry, especially in software engineering. I know you work at Google, so I'd love to get your insights.",
      timestamp: "10:37 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "You",
      content: "I'd be happy to help! The transition from academia to tech can be exciting. Are you looking for advice on technical skills, interview preparation, or company culture?",
      timestamp: "10:40 AM",
      isMe: true
    },
    {
      id: 5,
      sender: "Sarah Chen",
      content: "All of the above, really! But I'm particularly interested in understanding what the day-to-day work is like and how to prepare for technical interviews.",
      timestamp: "10:42 AM",
      isMe: false
    },
    {
      id: 6,
      sender: "You",
      content: "Great questions! For technical interviews, I recommend practicing on platforms like LeetCode and understanding system design basics. Would you like to schedule a video call to discuss this in more detail?",
      timestamp: "10:45 AM",
      isMe: true
    },
    {
      id: 7,
      sender: "Sarah Chen",
      content: "That would be amazing! I'm free this week. Thanks for the career advice! Would love to schedule a follow-up meeting.",
      timestamp: "2 hours ago",
      isMe: false
    }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        
        {/* Chat Interface */}
        <div className="flex-1 md:ml-0 ml-0 flex">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r border-border bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Messages</h2>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            {/* Conversations List */}
            <div className="overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedChat === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {conversation.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(conversation.status)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {conversation.timestamp}
                          </span>
                          {conversation.unread > 0 && (
                            <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-1 min-w-[20px] h-5 rounded-full">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                            {selectedConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(selectedConversation.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {selectedConversation.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedConversation.status}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="icon" variant="ghost">
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Video className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.isMe ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            message.isMe
                              ? 'bg-primary text-primary-foreground ml-4'
                              : 'bg-muted text-foreground mr-4'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${message.isMe ? 'text-right' : 'text-left'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex items-end space-x-3">
                    <Button size="icon" variant="ghost">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      className="btn-professional bg-gradient-primary hover:opacity-90"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;