import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  MessageCircle,
  Send,
  Search,
  Loader,
  SquarePen
} from "lucide-react";
import { apiService, Conversation, ChatMessage, UserProfile } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Chat = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>((location.state as { userId?: string })?.userId || null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingConvos, setIsLoadingConvos] = useState(true);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [convoSearch, setConvoSearch] = useState('');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [directory, setDirectory] = useState<UserProfile[]>([]);
  const [directorySearch, setDirectorySearch] = useState('');
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const data = await apiService.listConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({ title: "Error", description: "Failed to load conversations", variant: "destructive" });
    } finally {
      setIsLoadingConvos(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    setIsLoadingThread(true);
    apiService.getThread(selectedUserId)
      .then(setMessages)
      .catch((error) => {
        console.error('Error loading thread:', error);
        toast({ title: "Error", description: "Failed to load conversation", variant: "destructive" });
      })
      .finally(() => setIsLoadingThread(false));

    const convo = conversations.find((c) => c.userId === selectedUserId);
    if (convo) setSelectedName(convo.name);
    else if (!selectedName) {
      apiService.getUserById(selectedUserId).then((u: UserProfile) => setSelectedName(u.name)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    setIsSending(true);
    try {
      const sent = await apiService.sendMessage(selectedUserId, newMessage.trim());
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to send message", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  const initials = (name: string) => name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const openNewMessage = async () => {
    setIsNewMessageOpen(true);
    setIsLoadingDirectory(true);
    try {
      const users = await apiService.listUsers();
      setDirectory(users);
    } catch (error) {
      console.error('Error loading directory:', error);
      toast({ title: "Error", description: "Failed to load people", variant: "destructive" });
    } finally {
      setIsLoadingDirectory(false);
    }
  };

  const startConversationWith = (user: UserProfile) => {
    setSelectedUserId(user.id);
    setSelectedName(user.name);
    setIsNewMessageOpen(false);
    setDirectorySearch('');
  };

  const filteredConversations = conversations.filter((c) =>
    !convoSearch || c.name.toLowerCase().includes(convoSearch.toLowerCase())
  );

  const filteredDirectory = directory.filter((u) =>
    !directorySearch || u.name.toLowerCase().includes(directorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />

        {/* Chat Interface */}
        <div className="flex-1 md:ml-0 ml-0 flex">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r border-border bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Messages</h2>
                <Dialog open={isNewMessageOpen} onOpenChange={(open) => { setIsNewMessageOpen(open); if (open) openNewMessage(); }}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" title="New message">
                      <SquarePen className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search people..."
                          className="pl-10"
                          value={directorySearch}
                          onChange={(e) => setDirectorySearch(e.target.value)}
                        />
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-1">
                        {isLoadingDirectory ? (
                          <div className="flex items-center justify-center p-8">
                            <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : filteredDirectory.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center p-4">No one found</p>
                        ) : (
                          filteredDirectory.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent/50"
                              onClick={() => startConversationWith(user)}
                            >
                              <Avatar className="w-9 h-9">
                                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                                  {initials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">{user.userType}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={convoSearch}
                  onChange={(e) => setConvoSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              {isLoadingConvos ? (
                <div className="flex items-center justify-center p-8">
                  <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 && !selectedUserId ? (
                <div className="text-center p-8">
                  <p className="text-sm text-muted-foreground mb-3">No conversations yet.</p>
                  <Button size="sm" onClick={openNewMessage}>
                    <SquarePen className="w-4 h-4 mr-2" />
                    Start a conversation
                  </Button>
                </div>
              ) : filteredConversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center p-8">No conversations match "{convoSearch}"</p>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
                      selectedUserId === conversation.userId ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedUserId(conversation.userId)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {initials(conversation.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground truncate">{conversation.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.timestamp).toLocaleDateString()}
                            </span>
                            {conversation.unread > 0 && (
                              <Badge variant="default" className="bg-primary text-primary-foreground text-xs px-2 py-1 min-w-[20px] h-5 rounded-full">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedUserId ? (
              <>
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {selectedName ? initials(selectedName) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground">{selectedName}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingThread ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No messages yet. Say hello!</p>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${message.isMe ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-2xl ${message.isMe ? 'bg-primary text-primary-foreground ml-4' : 'bg-muted text-foreground mr-4'}`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className={`text-xs text-muted-foreground mt-1 ${message.isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border bg-card">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                        disabled={isSending}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="btn-professional bg-gradient-primary hover:opacity-90"
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the sidebar to start chatting</p>
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
