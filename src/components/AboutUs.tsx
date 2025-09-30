import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Award,
  Lightbulb,
  Zap,
  User,
  Phone,
} from "lucide-react";
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
      name: "RAVIKUMAR",
      role: "Assistant Professor",
      description: "9741970005",
      image: "/images/faculty/ravi-kumar.jpg",
    },
    {
      name: "RAGHURAMEGOWDA S M",
      role: "Assistant Professor",
      description: "9844926668",
      image: "/images/faculty/raghurame-gowda.jpg",
    },
    {
      name: "ANSER PASHA C A",
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
  ];

  const studentCoordinators = [
    {
      name: "ABHISHEK D S",
      role: "Student Coordinator",
      phone: "+91 8296590632",
      image: "/images/students/abhi.jpg",
    },
    {
      name: "AKSHATA CHITME",
      role: "Student Coordinator",
      phone: "+91 97310 88591",
      image: "/images/students/akshata.jpg",
    },
    {
      name: "DISHA GOWDA",
      role: "Student Coordinator",
      phone: "+91 93531 40736",
      image: "/images/students/disha.jpg",
    },
    {
      name: "JEWEL PINTO",
      role: "Student Coordinator",
      phone: "+91 80733 22353",
      image: "/images/students/jewel.jpg",
    },
    {
      name: "MOHAMMED ZAID ALI",
      role: "Student Coordinator",
      phone: "+91 91646 24616",
      image: "/images/students/zaid.jpg",
    },
    {
      name: "SHREYANKA A Y",
      role: "Student Coordinator",
      phone: "+91 6363745305",
      image: "/images/students/shreyanka.jpg",
    },
    {
      name: "SRIRAG D R",
      role: "Student Coordinator",
      phone: "+91 6361 065 881",
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
                <Target className="w-5 h-5" style={{ color: "#60a5fa" }} />
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
                <Zap className="w-5 h-5" style={{ color: "#60a5fa" }} />
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
                  {/* Student photo */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 hover:scale-105 transition-transform"
                    style={{ borderColor: "#60a5fa" }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = "none";
                      // Show fallback icon if image fails to load
                      const fallbackDiv = document.createElement("div");
                      fallbackDiv.className =
                        "w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-3 border-2 hover:scale-105 transition-transform";
                      fallbackDiv.style.borderColor = "#60a5fa";
                      fallbackDiv.innerHTML =
                        '<svg class="w-10 h-10" style="color: #60a5fa" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                      target.parentNode?.insertBefore(
                        fallbackDiv,
                        target.nextSibling
                      );
                    }}
                  />
                  {/* Student name */}
                  <h3
                    className="font-semibold mb-1 text-center"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {member.name}
                  </h3>
                  {/* Student role */}
                  <p
                    className="mb-2 text-center"
                    style={{ fontSize: "0.75rem", color: "#60a5fa" }}
                  >
                    {member.role}
                  </p>
                  {/* Contact icons */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() =>
                        window.open(`tel:${member.phone}`, "_self")
                      }
                      className="w-8 h-8 border-2 border-blue-400 hover:border-blue-500 hover:bg-blue-400/10 rounded-full flex items-center justify-center transition-all duration-200"
                      title="Call"
                    >
                      <Phone className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${member.phone.replace(
                            /[^0-9]/g,
                            ""
                          )}`,
                          "_blank"
                        )
                      }
                      className="w-8 h-8 border-2 border-green-500 hover:border-green-600 hover:bg-green-500/10 rounded-full flex items-center justify-center transition-all duration-200"
                      title="WhatsApp"
                    >
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </button>
                  </div>
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
