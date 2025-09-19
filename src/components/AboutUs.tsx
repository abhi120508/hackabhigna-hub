import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Heart, Zap } from "lucide-react";

export function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Fostering creativity and cutting-edge solutions",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Building strong communities and partnerships",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Striving for the highest standards in everything we do",
    },
    {
      icon: Lightbulb,
      title: "Learning",
      description: "Continuous growth and knowledge sharing",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Event Director",
      description: "Leading innovation in technology education",
    },
    {
      name: "Prof. Michael Chen",
      role: "Technical Lead",
      description: "Expert in AI and machine learning",
    },
    {
      name: "Emma Rodriguez",
      role: "Student Coordinator",
      description: "Passionate about student development",
    },
    {
      name: "Alex Kumar",
      role: "Operations Manager",
      description: "Ensuring smooth event execution",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            About HackAbhigna
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Empowering</span>
            <span className="text-accent-gradient"> Innovation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            HackAbhigna is more than a hackathon – it's a movement that brings
            together brilliant minds to solve real-world problems through
            technology and creativity.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To create a platform where students, developers, and innovators
                can collaborate, learn, and build solutions that make a positive
                impact on society. We believe in the power of technology to
                solve complex challenges and create a better future.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be the leading platform for technological innovation in
                India, fostering a culture of creativity, collaboration, and
                continuous learning. We envision a world where technology serves
                humanity and innovation knows no boundaries.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">
                  Participants
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">
                  20+
                </div>
                <div className="text-sm text-muted-foreground">
                  Universities
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹10L+
                </div>
                <div className="text-sm text-muted-foreground">
                  Impact Created
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
