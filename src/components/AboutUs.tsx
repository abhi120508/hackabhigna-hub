import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Zap } from "lucide-react";
import "./aboutus.css";
import "./global.css";

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
    <div className="w-full bg-gradient-to-br from-background to-muted/20 py-20 scroll-mt-102 mb-10" style={{ marginTop: "220px" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge  className="mb-4 orbitron-neon text-lg text-white md:text-3xl lg:text-2xl">
            About HackAbhigna
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 orbitron-neon" style={{ color: ' rgb(201, 114, 219)'}}>
            <span>Empowering</span>
            <span> Innovation</span>
          </h1>
          <p className="text-xl text-white text-muted-foreground max-w-3xl mx-auto orbitron-neon">
            HackAbhigna is more than a hackathon – it's a movement that brings
            together brilliant minds to solve real-world problems through
            technology and creativity.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 orbitron-neon">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground orbitron-neon text-white text-base md:text-lg lg:text-xl">
                To create a platform where students, developers, and innovators
                can collaborate, learn, and build solutions that make a positive
                impact on society. We believe in the power of technology to
                solve complex challenges and create a better future.
              </p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 orbitron-neon  ">
                <Zap className="w-6 h-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground orbitron-neon text-base md:text-lg lg:text-xl text-white">
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
          <h2 className="text-3xl font-bold text-center mb-8 orbitron-neon">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="card text-center orbitron-neon">
                  <CardContent className="pt-6 relative z-10">
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
        <div className="mb-40">
          <h2 className="text-3xl font-bold text-center mb-8 orbitron-neon">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="card text-center orbitron-neon">
                <CardContent className="pt-6 relative z-10">
                  <div className="w-20 h-20 bg-transparent rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="team-icon" />
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
        <Card className="my-24 card">
          <CardHeader>
            <CardTitle className="text-center orbitron-neon">
              Our Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center orbitron-neon">
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
                <div className="text-3xl font-bold text-secondary mb-2">20+</div>
                <div className="text-sm text-muted-foreground">
                  Universities
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">₹10L+</div>
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
