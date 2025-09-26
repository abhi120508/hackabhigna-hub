import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Lightbulb, Zap, User } from "lucide-react";
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

  const facultyCoordinators = [
    {
      name: "ANSER PASHA",
      role: "Assistant Professor",
      description: "9880744210",
      image: "/images/faculty/anser-pasha.jpg",
    },
    {
      name: "HARISH S",
      role: "Assistant Professor",
      description: "9964027241",
      image: "/images/faculty/harish-s.jpg",
    },
    {
      name: "RAGHURAME GOWDA",
      role: "Assistant Professor",
      description: "9844926668",
      image: "/images/faculty/raghurame-gowda.jpg",
    },
    {
      name: "RAVI KUMAR",
      role: "Assistant Professor",
      description: "9741970005",
      image: "/images/faculty/ravi-kumar.jpg",
    },
  ];

  const studentCoordinators = [
    {
      name: "ABHISHEK D S",
      role: "Student Coordinator",

      image: "/images/students/abhishek.jpg",
    },
    {
      name: "AKSHATA CHITME",
      role: "Student Coordinator",

      image: "/images/students/akshata.jpg",
    },
    {
      name: "DISHA GOWDA",
      role: "Student Coordinator",

      image: "/images/students/disha.jpg",
    },
    {
      name: "JUVEIL PINTO",
      role: "Student Coordinator",

      image: "/images/students/jevwl.jpg",
    },
    {
      name: "MOHAMMED ZAID ALI",
      role: "Student Coordinator",

      image: "/images/students/zaid.jpg",
    },
    {
      name: "SHREYANKA A Y",
      role: "Student Coordinator",

      image: "/images/students/shreyanka.jpg",
    },
    {
      name: "SRIRAG D R",
      role: "Student Coordinator",

      image: "/images/students/srirag.jpg",
    },
  ];

  return (
    <div
      id="about-us"
      className="w-full bg-gradient-to-br from-background to-muted/20 py-16 md:py-20 mb-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* CHANGE 1: Reduced badge font size */}
          <Badge
            className="mb-4 orbitron-neon text-white"
            style={{ fontSize: "1rem" }}
          >
            About HackAbhigna
          </Badge>
          {/* CHANGE 2: Reduced main title font size */}
          <h1
            className="text-3xl md:text-4xl font-bold mb-6 orbitron-neon"
            style={{ color: "#60a5fa" }}
          >
            <span>Empowering</span>
            <span> Innovation</span>
          </h1>
          {/* CHANGE 3: Reduced paragraph font size and improved alignment */}
          <p
            className="text-white text-muted-foreground max-w-3xl mx-auto orbitron-neon text-center"
            style={{ fontSize: "1rem", lineHeight: "1.6" }}
          >
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
                <Target
                  className="w-5 h-5"
                  style={{ color: "#60a5fa" }}
                />
                {/* CHANGE 4: Reduced Mission title font size */}
                <span style={{ fontSize: "1.125rem" }}>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CHANGE 5: Reduced mission description font size */}
              <p
                className="text-white orbitron-neon text-left"
                style={{ fontSize: "0.875rem", lineHeight: "1.5" }}
              >
                To create a platform where students, developers, and innovators
                can collaborate, learn, and build solutions that make a positive
                impact on society. We believe in the power of technology to
                solve complex challenges and create a better future.
              </p>
            </CardContent>
          </Card>

          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 orbitron-neon">
                <Zap
                  className="w-5 h-5"
                  style={{ color: "#60a5fa" }}
                />
                {/* CHANGE 6: Reduced Vision title font size */}
                <span style={{ fontSize: "1.125rem" }}>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CHANGE 7: Reduced vision description font size */}
              <p
                className="text-white orbitron-neon text-left"
                style={{ fontSize: "0.875rem", lineHeight: "1.5" }}
              >
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
          {/* CHANGE 8: Reduced Values section title font size + CHANGE 24: Added purple color */}
          <h2
            className="font-bold text-center mb-8 orbitron-neon"
            style={{ fontSize: "2rem", color: "#60a5fa" }}
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
                      style={{ color: "#60a5fa" }}
                    />
                    {/* CHANGE 9: Reduced value title font size */}
                    <h3
                      className="font-semibold mb-2"
                      style={{ fontSize: "1rem" }}
                    >
                      {value.title}
                    </h3>
                    {/* CHANGE 10: Reduced value description font size */}
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.75rem", lineHeight: "1.4" }}
                    >
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Faculty Coordinators */}
        <div className="mb-16">
          {/* CHANGE 11: Reduced Faculty Coordinators title font size + CHANGE 25: Added purple color */}
          <h2
            className="font-bold text-center mb-8 orbitron-neon"
            style={{ fontSize: "2rem", color: "#60a5fa" }}
          >
            Faculty Coordinators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyCoordinators.map((member, idx) => (
              <Card
                key={idx}
                className="card text-center orbitron-neon"
                style={{ minHeight: "250px" }}
              >
                <CardContent className="pt-6 relative z-10 flex flex-col items-center">
                  {/* Faculty photo */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 hover:scale-105 transition-transform"
                    style={{ borderColor: "#60a5fa" }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  {/* CHANGE 13: Reduced faculty name font size */}
                  <h3
                    className="font-semibold mb-1 text-center"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {member.name}
                  </h3>
                  {/* CHANGE 14: Reduced faculty role font size */}
                  <p
                    className="mb-1 text-center"
                  style={{ fontSize: "0.75rem", color: "#60a5fa" }}
                  >
                    {member.role}
                  </p>
                  {/* CHANGE 15: Reduced faculty description font size */}
                  <p
                    className="text-muted-foreground text-center"
                    style={{ fontSize: "0.625rem" }}
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
            style={{ fontSize: "2rem", color: "#60a5fa" }}
          >
            Student Coordinators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentCoordinators.map((member, idx) => (
              <Card
                key={idx}
                className="card text-center orbitron-neon"
                style={{ minHeight: "250px" }}
              >
                <CardContent className="pt-6 relative z-10 flex flex-col items-center">
                  {/* CHANGE 17: Replaced image with User icon as fallback */}
                  <div
                    className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-3 border-2 hover:scale-105 transition-transform"
                    style={{ borderColor: "#60a5fa" }}
                  >
                    <User
                      className="w-10 h-10"
                      style={{ color: "#60a5fa" }}
                    />
                  </div>
                  {/* CHANGE 18: Reduced student name font size */}
                  <h3
                    className="font-semibold mb-1 text-center"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {member.name}
                  </h3>
                  {/* CHANGE 19: Reduced student role font size */}
                  <p
                    className="mb-1 text-center"
                  style={{ fontSize: "0.75rem", color: "#60a5fa" }}
                  >
                    {member.role}
                  </p>
                  {/* CHANGE 20: Reduced student description font size */}
                  <p
                    className="text-muted-foreground text-center"
                    style={{ fontSize: "0.625rem" }}
                  >
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
            {/* CHANGE 21: Reduced stats title font size */}
            <CardTitle
              className="text-center orbitron-neon"
              style={{ fontSize: "1.5rem" }}
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
                  style={{ fontSize: "2rem", color: "#60a5fa" }}
                >
                  400+
                </div>
                {/* CHANGE 23: Reduced stats labels font size */}
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  Participants
                </div>
              </div>
              <div>
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "2rem", color: "#60a5fa" }}
                >
                  100+
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  Projects
                </div>
              </div>
              <div>
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "2rem", color: "#60a5fa" }}
                >
                  20+
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
                  Colleges
                </div>
              </div>
              <div>
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: "2rem", color: "#60a5fa" }}
                >
                  ₹1L+
                </div>
                <div
                  className="text-muted-foreground"
                  style={{ fontSize: "0.75rem" }}
                >
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
