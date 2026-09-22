import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Meetings from "./pages/Meetings";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import Community from "./pages/Community";
import Events from "./pages/Events";
import InterviewPrep from "./pages/InterviewPrep";
import Leaderboard from "./pages/Leaderboard";
import Fundraising from "./pages/Fundraising";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/search" element={<Search />} />
          <Route path="/dashboard/chat" element={<Chat />} />
          <Route path="/dashboard/meetings" element={<Meetings />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/profile/:id" element={<ProfileView />} />
          <Route path="/dashboard/community" element={<Community />} />
          <Route path="/dashboard/events" element={<Events />} />
          <Route path="/dashboard/interview-prep" element={<InterviewPrep />} />
          <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard/fundraising" element={<Fundraising />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
