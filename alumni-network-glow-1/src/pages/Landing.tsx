import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, Calendar, Star, ArrowRight, Network, Target, Shield, GraduationCap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Network,
      title: "Smart Networking",
      description: "Connect with alumni and students based on shared interests, skills, and career paths.",
      path: "/dashboard/search"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Engage in meaningful conversations through our integrated messaging system.",
      path: "/dashboard/chat"
    },
    {
      icon: Calendar,
      title: "Meeting Scheduler",
      description: "Schedule mentorship sessions and networking meetings with ease.",
      path: "/dashboard/meetings"
    },
    {
      icon: Star,
      title: "Feedback System",
      description: "Build trust through transparent ratings and feedback from the community.",
      path: "/dashboard/feedback"
    },
    {
      icon: Target,
      title: "Career Goals",
      description: "Get matched with mentors who can help you achieve your professional objectives.",
      path: "/profile-setup"
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Connect with confidence through our verified alumni and student network.",
      path: "/dashboard/profile"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Connect 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Students </span>
              & 
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"> Alumni</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Bridge the gap between academic learning and professional success. Connect, learn, and grow 
              with our vibrant community of students and accomplished alumni.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="btn-professional bg-gradient-primary hover:opacity-90 px-8 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="btn-professional px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose GradConnect?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform is designed to foster meaningful connections and accelerate career growth 
              through structured networking and mentorship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-interactive group cursor-pointer" onClick={() => feature.path && navigate(feature.path)}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                1000+
              </div>
              <p className="text-muted-foreground text-lg">Active Alumni</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-muted-foreground text-lg">Students Connected</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                95%
              </div>
              <p className="text-muted-foreground text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students and alumni who are already building meaningful 
            professional relationships on our platform.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="btn-professional px-8 py-6 text-lg"
          >
            Join GradConnect Today
            <Users className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                GradConnect
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 GradConnect. Connecting generations of learners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;