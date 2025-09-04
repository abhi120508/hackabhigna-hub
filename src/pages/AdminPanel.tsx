import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  Download,
  Phone,
  Github,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MockDatabase, MockAPI, TeamRegistration } from "@/lib/mockBackend";

// Using TeamRegistration interface from mockBackend

// Using mock data from MockDatabase

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [statistics, setStatistics] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations();
    }
  }, [isAuthenticated]);

  const loadRegistrations = async () => {
    const data = await MockAPI.getRegistrations();
    setRegistrations(data);
    setStatistics(MockDatabase.getStatistics());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Panel",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid password",
      });
    }
  };

  const handleApproval = async (
    registrationId: string,
    status: "approved" | "rejected"
  ) => {
    const result = await MockAPI.updateTeamStatus(registrationId, status);
    
    if (result.success) {
      // Send QR code email if approved
      if (status === "approved" && result.data) {
        await MockAPI.sendQRCodeEmail(result.data);
      }
      
      await loadRegistrations(); // Reload data
      
      const action = status === "approved" ? "approved" : "rejected";
      toast({
        title: `Registration ${action}`,
        description: result.message + (status === "approved" ? " QR code sent via email." : ""),
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
      });
    }
  };

  const domains = [
    { value: "all", label: "All Domains" },
    { value: "web", label: "Web Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "wildcard", label: "Wildcard" },
  ];

  const filteredRegistrations =
    selectedDomain === "all"
      ? registrations
      : registrations.filter((reg) => reg.domain === selectedDomain);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-gradient">
              Admin Access
            </CardTitle>
            <p className="text-muted-foreground">
              Enter admin password to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage registrations and approvals
          </p>
        </div>

        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="space-y-6">
            {/* Domain Filter */}
            <div className="flex flex-wrap gap-2">
              {domains.map((domain) => (
                <Button
                  key={domain.value}
                  variant={
                    selectedDomain === domain.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedDomain(domain.value)}
                >
                  {domain.label}
                </Button>
              ))}
            </div>

            {/* Registrations List */}
            <div className="grid gap-6">
              {filteredRegistrations.map((registration) => (
                <Card
                  key={registration.id}
                  className="bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">
                          {registration.teamName}
                        </CardTitle>
                        <Badge
                          variant={
                            registration.status === "approved"
                              ? "default"
                              : registration.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {registration.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {
                          domains.find((d) => d.value === registration.domain)
                            ?.label
                        }
                      </Badge>
                    </div>
                  </CardHeader>
                   <CardContent className="space-y-4">
                     {/* Show unique ID and GitHub repo for approved teams */}
                     {registration.status === "approved" && registration.uniqueId && (
                       <div className="bg-accent/10 p-4 rounded-lg border">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <span className="font-semibold">Unique ID:</span>
                             <span className="text-primary ml-2 font-mono text-lg">
                               {registration.uniqueId}
                             </span>
                           </div>
                           <div>
                             <span className="font-semibold">GitHub Repository:</span>
                             <a
                               href={registration.githubRepo}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-primary hover:underline ml-2 flex items-center gap-1"
                             >
                               <Github className="w-4 h-4" />
                               {registration.githubRepo}
                             </a>
                           </div>
                         </div>
                       </div>
                     )}

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <h4 className="font-semibold mb-2 flex items-center gap-2">
                           <Users className="w-4 h-4" />
                           Team Members
                         </h4>
                         <div className="space-y-1">
                           {registration.participants.map(
                             (participant, index) => (
                               <div key={index} className="text-sm">
                                 <span className="font-medium">
                                   {participant.name}
                                   {index === registration.leaderIndex && (
                                     <Badge variant="outline" className="ml-1 text-xs">
                                       Leader
                                     </Badge>
                                   )}
                                 </span>
                                 <div className="text-muted-foreground ml-2">
                                   <Mail className="w-3 h-3 inline mr-1" />
                                   {participant.email}
                                   {participant.mobile && (
                                     <div>
                                       <Phone className="w-3 h-3 inline mr-1" />
                                       {participant.mobile}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             )
                           )}
                         </div>
                       </div>
                       <div className="space-y-2">
                         <div>
                           <h4 className="font-semibold mb-2 flex items-center gap-2">
                             <Phone className="w-4 h-4" />
                             Contact Information
                           </h4>
                           <div className="text-sm space-y-1">
                             <div>
                               <span className="font-medium">Leader Mobile:</span>
                               <span className="ml-2">{registration.leaderMobile}</span>
                             </div>
                             <div>
                               <span className="font-medium">Alternate Mobile:</span>
                               <span className="ml-2">{registration.alternateMobile}</span>
                             </div>
                           </div>
                         </div>
                         <div>
                           <span className="font-semibold">Original Repository:</span>
                           <a
                             href={registration.gitRepo}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-primary hover:underline ml-2"
                           >
                             {registration.gitRepo}
                           </a>
                         </div>
                         <div>
                           <span className="font-semibold">Payment Proof:</span>
                           <Button variant="outline" size="sm" className="ml-2">
                             <Download className="w-4 h-4 mr-1" />
                             View
                           </Button>
                         </div>
                       </div>
                     </div>

                    {registration.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() =>
                            handleApproval(registration.id, "approved")
                          }
                          variant="default"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            handleApproval(registration.id, "rejected")
                          }
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            {/* Certificate Management */}
            {domains.slice(1).map((domain) => {
              const admittedTeams = registrations.filter(
                (reg) =>
                  reg.domain === domain.value && reg.status === "approved"
              );

              return (
                <Card
                  key={domain.value}
                  className="bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{domain.label}</span>
                      <Badge variant="outline">
                        {admittedTeams.length} Teams
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {admittedTeams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold">{team.teamName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Members:{" "}
                              {team.participants.map((p) => p.name).join(", ")}
                            </p>
                          </div>
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Certificate Issued!",
                                description: `Certificate sent to ${team.teamName} team lead via email.`,
                              });
                            }}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Issue Certificate
                          </Button>
                        </div>
                      ))}
                      {admittedTeams.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">
                          No admitted teams in this domain yet.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {registrations.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Approved Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {
                      registrations.filter((r) => r.status === "approved")
                        .length
                    }
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {registrations.filter((r) => r.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
