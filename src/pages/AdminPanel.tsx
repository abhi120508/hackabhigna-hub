import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
// import { MockDatabase, MockAPI, TeamRegistration } from "@/lib/mockBackend";
import { TeamRegistration } from "@/lib/mockBackend"; // Keep type definition

import * as XLSX from "xlsx";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCodeGenerator from "@/components/QRCodeGenerator";

interface Statistics {
  total?: number;
  approved?: number;
  pending?: number;
  rejected?: number;
  byDomain?: {
    [key: string]: number;
  };
}

interface DomainSetting {
  domain: string;
  maxSlots: number;
  paused: boolean;
  slotsLeft: number;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [statistics, setStatistics] = useState<Statistics>({});
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [domainSettings, setDomainSettings] = useState<DomainSetting[]>([]);
  const [globalSettings, setGlobalSettings] = useState({
    pausedLeaderboard: false,
  });
  const [allDomainsPaused, setAllDomainsPaused] = useState(false);
  const { toast } = useToast();

  const API_URL = "https://hackabhigna-hub.onrender.com"; // Your backend URL

  const loadRegistrations = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/registrations`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data: (TeamRegistration & { _id: string })[] =
        await response.json();
      // Map _id to id and ensure utrNumber is included if present
      const formattedData = data.map((item) => ({
        ...item,
        id: item._id,
        utrNumber: item.utrNumber || "", // Ensure utrNumber is fetched properly
      }));
      setRegistrations(formattedData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading registrations",
        description: (error as Error).message,
      });
    }
  }, [toast]);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/statistics`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading statistics",
        description: (error as Error).message,
      });
    }
  }, [toast]);

  const loadDomainSettings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/domain-settings`);
      if (!response.ok) throw new Error("Failed to fetch domain settings");
      const data = await response.json();
      setDomainSettings(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading domain settings",
        description: (error as Error).message,
      });
    }
  }, [toast]);

  const loadGlobalSettings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/global-settings`);
      if (!response.ok) throw new Error("Failed to fetch global settings");
      const data = await response.json();
      setGlobalSettings(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading global settings",
        description: (error as Error).message,
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations();
      loadStatistics();
      loadDomainSettings();
      loadGlobalSettings();
    }
  }, [
    isAuthenticated,
    loadRegistrations,
    loadStatistics,
    loadDomainSettings,
    loadGlobalSettings,
  ]);

  // Reload domain settings after toggle to reflect changes immediately
  useEffect(() => {
    if (isAuthenticated) {
      loadDomainSettings();
    }
  }, [domainSettings, isAuthenticated]);

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
    try {
      const response = await fetch(
        `${API_URL}/registrations/${registrationId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status");
      }

      toast({
        title: `Registration ${status}`,
        description: result.message,
      });

      loadRegistrations();
      loadStatistics();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Error",
        description: (error as Error).message,
      });
    }
  };

  const handleDomainToggle = async (domain: string, paused: boolean) => {
    try {
      // Optimistically update UI
      setDomainSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.domain === domain ? { ...setting, paused } : setting
        )
      );

      const response = await fetch(
        `${API_URL}/domain-settings/${encodeURIComponent(domain)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paused }),
        }
      );

      if (!response.ok) throw new Error("Failed to update domain settings");

      toast({
        title: "Domain settings updated",
        description: `${domain} registrations ${paused ? "paused" : "resumed"}`,
      });

      loadDomainSettings();
    } catch (error) {
      // Revert optimistic update on error
      setDomainSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.domain === domain ? { ...setting, paused: !paused } : setting
        )
      );
      toast({
        variant: "destructive",
        title: "Update Error",
        description: (error as Error).message,
      });
    }
  };

  const handleGlobalToggle = async (setting: string, value: boolean) => {
    try {
      const response = await fetch(`${API_URL}/global-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [setting]: value }),
      });

      if (!response.ok) throw new Error("Failed to update global settings");

      toast({
        title: "Global settings updated",
        description: `${setting} ${value ? "enabled" : "disabled"}`,
      });

      loadGlobalSettings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Error",
        description: (error as Error).message,
      });
    }
  };

  // Check if all domains are paused
  const checkAllDomainsPaused = useCallback(() => {
    const allPaused =
      domainSettings.length > 0 &&
      domainSettings.every((setting) => setting.paused);
    setAllDomainsPaused(allPaused);
  }, [domainSettings]);

  // Handle PDF download
  const handleDownloadPDF = async () => {
    // Deprecated: replaced by Excel download
  };

  // Handle Excel download
  const handleDownloadExcel = () => {
    try {
      if (registrations.length === 0) {
        toast({
          variant: "destructive",
          title: "No Data",
          description: "No registrations available to export.",
        });
        return;
      }

      // Group registrations by domain
      const groupedByDomain: { [domain: string]: TeamRegistration[] } = {};
      registrations.forEach((reg) => {
        if (!groupedByDomain[reg.domain]) {
          groupedByDomain[reg.domain] = [];
        }
        groupedByDomain[reg.domain].push(reg);
      });

      // Prepare worksheet data
      const wsData: Array<Array<string | number>> = [];
      const domainRowIndices: number[] = [];

      // For each domain, add a header row and team rows
      Object.entries(groupedByDomain).forEach(([domain, teams]) => {
        // Add domain as a merged header row
        domainRowIndices.push(wsData.length);
        wsData.push([domain]);
        // Add column headers
        wsData.push([
          "Team Name",
          "Team Code",
          "Member Names",
          "Member Emails",
          "GitHub URL",
          "Leader Mobile",
          "Alternate Mobile",
          "Member Mobile Numbers",
        ]);
        // Add team rows with members in separate rows
        teams.forEach((team) => {
          const members = team.participants;
          members.forEach((member, index) => {
            const memberName =
              index === team.leaderIndex ? `${member.name} (L)` : member.name;
            wsData.push([
              index === 0 ? team.teamName : "",
              index === 0 ? team.teamCode : "",
              memberName,
              member.email,
              index === 0 ? team.gitRepo || "" : "",
              index === 0 ? team.leaderMobile || "" : "",
              index === 0 ? team.alternateMobile || "" : "",
              member.mobile ?? "",
            ]);
          });
          // Add empty row for spacing between teams
          wsData.push([]);
        });
        // Add empty row for spacing between domains
        wsData.push([]);
      });

      // Create worksheet and workbook
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Apply bold font style to domain rows
      domainRowIndices.forEach((rowIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ c: 0, r: rowIndex });
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = {
          font: { bold: true },
        };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Teams");

      // Generate Excel file and trigger download
      XLSX.writeFile(
        wb,
        `hackabhigna-teams-report-${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );

      toast({
        title: "Download Successful",
        description: "Teams report Excel file has been downloaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: (error as Error).message,
      });
    }
  };

  // Update allDomainsPaused whenever domainSettings change
  useEffect(() => {
    checkAllDomainsPaused();
  }, [checkAllDomainsPaused]);

  const domains = [
    { value: "all", label: "All Domains" },
    {
      value: "GenAI/AgenticAI in Agriculture",
      label: "GenAI/AgenticAI in Agriculture",
    },
    {
      value: "GenAI/AgenticAI in FinTech",
      label: "GenAI/AgenticAI in FinTech",
    },
    {
      value: "GenAI/AgenticAI in Education",
      label: "GenAI/AgenticAI in Education",
    },
    { value: "Wildcard", label: "Wildcard" },
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
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      {/* Removed UTR display from top right */}
                      {/* <div className="ml-4 font-mono text-sm">
                        UTR: {registration.utrNumber || "N/A"}
                      </div> */}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Show unique ID and GitHub repo for approved teams */}
                    {registration.status === "approved" &&
                      registration.teamCode && (
                        <div className="bg-accent/10 p-4 rounded-lg border">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-semibold">Unique ID:</span>
                              <span className="text-primary ml-2 font-mono text-lg">
                                {registration.teamCode}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">
                                GitHub Repository:
                              </span>
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
                          <div className="mt-4">
                            <span className="font-semibold">QR Code:</span>
                            {registration.qrCodeImageUrl &&
                            registration.qrCodeImageUrl.startsWith("http") ? (
                              <img
                                src={registration.qrCodeImageUrl}
                                alt={`QR Code for ${registration.teamCode}`}
                                width={128}
                                height={128}
                                className="mx-auto"
                              />
                            ) : (
                              <QRCodeGenerator
                                value={registration.teamCode}
                                size={128}
                              />
                            )}
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
                                    <Badge
                                      variant="outline"
                                      className="ml-1 text-xs"
                                    >
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
                              <span className="font-medium">
                                Leader Mobile:
                              </span>
                              <span className="ml-2">
                                {registration.leaderMobile}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                Alternate Mobile:
                              </span>
                              <span className="ml-2">
                                {registration.alternateMobile}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold">
                            Original Repository:
                          </span>
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
                          <span className="font-semibold">UTR Number: </span>
                          <span className="mb-2 font-mono">
                            {registration.utrNumber || "N/A"}
                          </span>
                          <div className="mt-2">
                            <span className="font-semibold">
                              Payment Proof:
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Payment Proof</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                  <img
                                    src={registration.paymentProof}
                                    alt="Payment Proof"
                                    className="max-w-full h-auto rounded-md"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
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
                            <h4 className="font-semibold flex items-center gap-2">
                              {team.teamName}
                              <Badge variant="secondary">{team.teamCode}</Badge>
                            </h4>
                            <div className="text-sm text-muted-foreground mt-2 space-y-1">
                              {team.participants.map((p, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>
                                    {p.name} - {p.email}
                                  </span>
                                </div>
                              ))}
                            </div>
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
                    {statistics.total ?? registrations.length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Approved Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {statistics.approved ??
                      registrations.filter((r) => r.status === "approved")
                        .length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {statistics.pending ??
                      registrations.filter((r) => r.status === "pending")
                        .length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Download Teams Report */}
            {allDomainsPaused && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Download Teams Report</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Download a comprehensive PDF report of all approved teams
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleDownloadExcel}
                    variant="hero"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Teams Excel Report
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This option is available when all domains are paused
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Domain Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Control registration availability per domain
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {domainSettings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No domain settings available.
                    </p>
                  ) : (
                    domainSettings.slice(0, 4).map((setting: DomainSetting) => {
                      // Map backend domain keys to frontend domain values for label and toggle
                      const domainKeyMap: { [key: string]: string } = {
                        "GenAI/AgenticAI in Agriculture":
                          "GenAI/AgenticAI in Agriculture",
                        "GenAI/AgenticAI in FinTech":
                          "GenAI/AgenticAI in FinTech",
                        "GenAI/AgenticAI in Education":
                          "GenAI/AgenticAI in Education",
                        Wildcard: "Wildcard",
                      };
                      const mappedDomainValue =
                        domainKeyMap[setting.domain] || setting.domain;
                      const domainLabel =
                        domains.find((d) => d.value === mappedDomainValue)
                          ?.label || setting.domain;
                      return (
                        <div
                          key={setting.domain}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <Label className="text-sm font-medium">
                              {domainLabel}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Slots Remaining:{" "}
                              {
                                // Map slotsLeft from backend domain keys to frontend domain keys
                                (() => {
                                  const slotsMap: { [key: string]: number } =
                                    {};
                                  domainSettings.forEach((ds) => {
                                    const domainKeyMap: {
                                      [key: string]: string;
                                    } = {
                                      "GenAI/AgenticAI in Agriculture":
                                        "GenAI/AgenticAI in Agriculture",
                                      "GenAI/AgenticAI in FinTech":
                                        "GenAI/AgenticAI in FinTech",
                                      "GenAI/AgenticAI in Education":
                                        "GenAI/AgenticAI in Education",
                                      Wildcard: "Wildcard",
                                    };
                                    const mappedKey =
                                      domainKeyMap[ds.domain] || ds.domain;
                                    slotsMap[mappedKey] = ds.slotsLeft;
                                  });
                                  return (
                                    slotsMap[mappedDomainValue] ??
                                    setting.slotsLeft
                                  );
                                })()
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Registrations are{" "}
                              {setting.paused ? "Paused" : "Enabled"}
                            </p>
                          </div>
                          <Switch
                            checked={!setting.paused}
                            onCheckedChange={(checked) =>
                              handleDomainToggle(setting.domain, !checked)
                            }
                          />
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    System-wide configuration
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">
                        Pause Leaderboard
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Hide leaderboard from participants
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.pausedLeaderboard}
                      onCheckedChange={(checked) =>
                        handleGlobalToggle("pausedLeaderboard", checked)
                      }
                    />
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
