import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
<<<<<<< HEAD
import { Users, Target, Award, Lightbulb, Heart, Zap } from "lucide-react";
=======
import { Users, Target, Award, Lightbulb, Zap, User } from "lucide-react";
import "./aboutus.css";
import "./global.css";
>>>>>>> friend-updates

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

<<<<<<< HEAD
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
=======
  const facultyCoordinators = [
    {
      name: "Ravi Kumar",
      role: "Assistant Professor",
      description: "123456789",
      image: "/images/faculty/ravi-kumar.jpg",
    },
    {
      name: "RAGHURAME GOWDA",
      role: "Assistant Professor",
      description: "123456789",
      image: "/images/faculty/raghurame-gowda.jpg",
    },
    {
      name: "ANSER PASHA",
      role: "Assistant Professor",
      description: "123456789",
      image: "/images/faculty/anser-pasha.jpg",
    },
    {
      name: "HARISH S",
      role: "Assistant Professor",
      description: "123456789",
      image: "/images/faculty/harish-s.jpg",
    },
  ];

  const studentCoordinators = [
    {
      name: "ABHISHEK D S",
      role: "Student Coordinator",
      description: "Passionate about student development",
      image: "/images/students/abhishek.jpg",
    },
    {
      name: "AKSHATA CHITME",
      role: "Student Coordinator",
      description: "Ensuring smooth event execution",
      image: "/images/students/akshata.jpg",
    },
    {
      name: "DISHA GOWDA",
      role: "Student Coordinator",
      description: "Passionate about student development",
      image: "/images/students/disha.jpg",
    },
    {
      name: "JEVWL PINTO",
      role: "Student Coordinator",
      description: "Ensuring smooth event execution",
      image: "/images/students/jevwl.jpg",
    },
    {
      name: "MOHAMMED ZAID ALI",
      role: "Student Coordinator",
      description: "Passionate about student development",
      image: "/images/students/zaid.jpg",
    },
    {
      name: "SHREYANKA A Y",
      role: "Student Coordinator",
      description: "Ensuring smooth event execution",
      image: "/images/students/shreyanka.jpg",
    },
    {
      name: "SRIRAG D R",
      role: "Student Coordinator",
      description: "Passionate about student development",
      image: "/images/students/srirag.jpg",
>>>>>>> friend-updates
    },
  ];

  return (
<<<<<<< HEAD
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
=======
    <div
      className="w-full bg-gradient-to-br from-background to-muted/20 py-20 scroll-mt-102 mb-10"
      style={{ marginTop: "200px" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* CHANGE 1: Reduced badge font size */}
          <Badge 
            className="mb-4 orbitron-neon text-white" 
            style={{ fontSize: '1rem' }}
          >
            About HackAbhigna
          </Badge>
          {/* CHANGE 2: Reduced main title font size */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-6 orbitron-neon"
            style={{ color: "rgb(201, 114, 219)" }}
          >
            <span>Empowering</span>
            <span> Innovation</span>
          </h1>
          {/* CHANGE 3: Reduced paragraph font size and improved alignment */}
          <p 
            className="text-white text-muted-foreground max-w-3xl mx-auto orbitron-neon text-center"
            style={{ fontSize: '1rem', lineHeight: '1.6' }}
          >
>>>>>>> friend-updates
            HackAbhigna is more than a hackathon – it's a movement that brings
            together brilliant minds to solve real-world problems through
            technology and creativity.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
<<<<<<< HEAD
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
=======
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 orbitron-neon">
                <Target 
                  className="w-5 h-5" 
                  style={{ color: 'rgb(201, 114, 219)' }}
                />
                {/* CHANGE 4: Reduced Mission title font size */}
                <span style={{ fontSize: '1.125rem' }}>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CHANGE 5: Reduced mission description font size */}
              <p 
                className="text-white orbitron-neon text-left"
                style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
              >
>>>>>>> friend-updates
                To create a platform where students, developers, and innovators
                can collaborate, learn, and build solutions that make a positive
                impact on society. We believe in the power of technology to
                solve complex challenges and create a better future.
              </p>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
=======
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 orbitron-neon">
                <Zap 
                  className="w-5 h-5" 
                  style={{ color: 'rgb(201, 114, 219)' }}
                />
                {/* CHANGE 6: Reduced Vision title font size */}
                <span style={{ fontSize: '1.125rem' }}>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CHANGE 7: Reduced vision description font size */}
              <p 
                className="text-white orbitron-neon text-left"
                style={{ fontSize: '0.875rem', lineHeight: '1.5' }}
              >
>>>>>>> friend-updates
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
<<<<<<< HEAD
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
=======
          {/* CHANGE 8: Reduced Values section title font size + CHANGE 24: Added purple color */}
          <h2 
            className="font-bold text-center mb-8 orbitron-neon"
            style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="card text-center orbitron-neon">
                  <CardContent className="pt-6 relative z-10">
                    <Icon 
                      className="w-10 h-10 mx-auto mb-4" 
                      style={{ color: 'rgb(201, 114, 219)' }}
                    />
                    {/* CHANGE 9: Reduced value title font size */}
                    <h3 
                      className="font-semibold mb-2"
                      style={{ fontSize: '1rem' }}
                    >
                      {value.title}
                    </h3>
                    {/* CHANGE 10: Reduced value description font size */}
                    <p 
                      className="text-muted-foreground"
                      style={{ fontSize: '0.75rem', lineHeight: '1.4' }}
                    >
>>>>>>> friend-updates
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Faculty Coordinators */}
        <div className="mb-16">
          {/* CHANGE 11: Reduced Faculty Coordinators title font size + CHANGE 25: Added purple color */}
          <h2 
            className="font-bold text-center mb-8 orbitron-neon"
            style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
          >
            Faculty Coordinators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyCoordinators.map((member, idx) => (
              <Card
                key={idx}
                className="card text-center orbitron-neon"
                style={{ minHeight: '250px' }}
              >
                <CardContent className="pt-6 relative z-10 flex flex-col items-center">
                  {/* CHANGE 12: Replaced image with User icon as fallback */}
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-3 border-2 hover:scale-105 transition-transform"
                       style={{ borderColor: 'rgb(201, 114, 219)' }}>
                    <User 
                      className="w-10 h-10" 
                      style={{ color: 'rgb(201, 114, 219)' }}
                    />
                  </div>
                  {/* CHANGE 13: Reduced faculty name font size */}
                  <h3 
                    className="font-semibold mb-1 text-center"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {member.name}
                  </h3>
                  {/* CHANGE 14: Reduced faculty role font size */}
                  <p 
                    className="mb-1 text-center"
                    style={{ fontSize: '0.75rem', color: 'rgb(201, 114, 219)' }}
                  >
                    {member.role}
                  </p>
                  {/* CHANGE 15: Reduced faculty description font size */}
                  <p 
                    className="text-muted-foreground text-center"
                    style={{ fontSize: '0.625rem' }}
                  >
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Coordinators */}
        <div className="mb-16">
          {/* CHANGE 16: Reduced Student Coordinators title font size + CHANGE 26: Added purple color */}
          <h2 
            className="font-bold text-center mb-8 orbitron-neon"
            style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
          >
            Student Coordinators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentCoordinators.map((member, idx) => (
              <Card
                key={idx}
                className="card text-center orbitron-neon"
                style={{ minHeight: '250px' }}
              >
                <CardContent className="pt-6 relative z-10 flex flex-col items-center">
                  {/* CHANGE 17: Replaced image with User icon as fallback */}
                  <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-3 border-2 hover:scale-105 transition-transform"
                       style={{ borderColor: 'rgb(201, 114, 219)' }}>
                    <User 
                      className="w-10 h-10" 
                      style={{ color: 'rgb(201, 114, 219)' }}
                    />
                  </div>
                  {/* CHANGE 18: Reduced student name font size */}
                  <h3 
                    className="font-semibold mb-1 text-center"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {member.name}
                  </h3>
                  {/* CHANGE 19: Reduced student role font size */}
                  <p 
                    className="mb-1 text-center"
                    style={{ fontSize: '0.75rem', color: 'rgb(201, 114, 219)' }}
                  >
                    {member.role}
                  </p>
                  {/* CHANGE 20: Reduced student description font size */}
                  <p 
                    className="text-muted-foreground text-center"
                    style={{ fontSize: '0.625rem' }}
                  >
>>>>>>> friend-updates
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
<<<<<<< HEAD
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">
=======
        <Card className="my-24 card">
          <CardHeader>
            {/* CHANGE 21: Reduced stats title font size */}
            <CardTitle 
              className="text-center orbitron-neon"
              style={{ fontSize: '1.5rem' }}
            >
              Our Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center orbitron-neon">
              <div>
                {/* CHANGE 22: Reduced stats numbers font size */}
                <div 
                  className="font-bold mb-2"
                  style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
                >
                  400+
                </div>
                {/* CHANGE 23: Reduced stats labels font size */}
                <div 
                  className="text-muted-foreground"
                  style={{ fontSize: '0.75rem' }}
                >
>>>>>>> friend-updates
                  Participants
                </div>
              </div>
              <div>
<<<<<<< HEAD
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
=======
                <div 
                  className="font-bold mb-2"
                  style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
                >
                  100+
                </div>
                <div 
                  className="text-muted-foreground"
                  style={{ fontSize: '0.75rem' }}
                >
                  Projects
                </div>
              </div>
              <div>
                <div 
                  className="font-bold mb-2"
                  style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
                >
                  20+
                </div>
                <div 
                  className="text-muted-foreground"
                  style={{ fontSize: '0.75rem' }}
                >
                  Colleges
                </div>
              </div>
              <div>
                <div 
                  className="font-bold mb-2"
                  style={{ fontSize: '2rem', color: 'rgb(201, 114, 219)' }}
                >
                  ₹1L+
                </div>
                <div 
                  className="text-muted-foreground"
                  style={{ fontSize: '0.75rem' }}
                >
>>>>>>> friend-updates
                  Impact Created
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> friend-updates
