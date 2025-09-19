import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Github,
  GitCommit,
  GitBranch,
  Activity,
  Save,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamRegistration } from "@/lib/mockBackend"; // Using the same type

const JudgePanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(
    null
  );
  const [selectedRound, setSelectedRound] = useState<string>("round1");
  const [score, setScore] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [judgeName, setJudgeName] = useState<string>("");
  const { toast } = useToast();

  const API_URL = "http://localhost:5000";

  const domains = [
    { value: "GenAI", label: "GenAI" },
    { value: "FinTech", label: "FinTech" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "wildcard", label: "wildcard" },
  ];

  const loadApprovedTeams = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/registrations`);
      if (!response.ok) throw new Error("Failed to fetch teams");
      const allTeams: (TeamRegistration & { _id: string })[] =
        await response.json();
      const approvedTeams = allTeams
        .filter((team) => team.status === "approved")
        .map((team) => ({ ...team, id: team._id }));
      setTeams(approvedTeams);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadApprovedTeams();
    }
  }, [isAuthenticated, loadApprovedTeams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure check
    if (password === "judge123") {
      setIsAuthenticated(true);
      toast({ title: "Login Successful" });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid password",
      });
    }
  };

  const handleSubmitScore = async () => {
    if (!selectedTeam || !score || !remarks || !judgeName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields",
      });
      return;
    }

    const scoreValue = parseInt(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      toast({
        variant: "destructive",
        title: "Invalid Score",
        description: "Score must be a number between 0 and 100",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/teams/${selectedTeam.id}/score`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            round: selectedRound,
            score: scoreValue,
            remarks,
            judge: judgeName,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit score");
      }

      toast({
        title: "Score Submitted",
        description: `Score for ${selectedTeam.teamName} has been saved.`,
      });

      // Refresh data
      loadApprovedTeams();
      // Reset form
      setScore("");
      setRemarks("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: (error as Error).message,
      });
    }
  };

  const getRoundDisplayName = (round: string) => {
    switch (round) {
      case "round1":
        return "Round 1";
      case "round2":
        return "Round 2";
      case "final":
        return "Final Round";
      default:
        return round;
    }
  };

  const teamsInSelectedDomain = selectedDomain
    ? teams.filter((team) => team.domain === selectedDomain)
    : [];

  if (!isAuthenticated) {
    return (
      <div className="dark min-h-screen flex items-center justify-center pt-16 bg-black">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-gradient">
              Judge Access
            </CardTitle>
            <p className="text-muted-foreground">
              Enter judge password to continue
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
                  placeholder="Enter judge password"
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
          <h1 className="text-3xl font-bold text-gradient mb-2">Judge Panel</h1>
          <p className="text-muted-foreground">
            Evaluate team performance and submit scores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Domain Accordion */}
                {domains.map((domain) => (
                  <div key={domain.value}>
                    <Button
                      variant={
                        selectedDomain === domain.value ? "default" : "outline"
                      }
                      className="w-full justify-between"
                      onClick={() =>
                        setSelectedDomain(
                          selectedDomain === domain.value ? null : domain.value
                        )
                      }
                    >
                      {domain.label}
                      <Badge variant="secondary">
                        {teams.filter((t) => t.domain === domain.value).length}
                      </Badge>
                    </Button>
                    {selectedDomain === domain.value && (
                      <div className="pl-4 mt-2 space-y-2">
                        {teamsInSelectedDomain.map((team) => (
                          <Button
                            key={team.id}
                            variant={
                              selectedTeam?.id === team.id
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start"
                            onClick={() => setSelectedTeam(team)}
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{team.teamCode}</Badge>
                              <span>{team.teamName}</span>
                            </div>
                          </Button>
                        ))}
                        {teamsInSelectedDomain.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            No teams in this domain.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Details & Scoring */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">
                    Repository Activity
                  </TabsTrigger>
                  <TabsTrigger value="scoring">Scoring</TabsTrigger>
                  <TabsTrigger value="history">Score History</TabsTrigger>
                </TabsList>

                <TabsContent value="activity">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        {selectedTeam.teamCode} - {selectedTeam.teamName}
                      </CardTitle>
                      <Badge variant="outline">{selectedTeam.domain}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Team Members</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeam.participants.map(
                            (participant, index) => (
                              <Badge
                                key={index}
                                variant={
                                  index === selectedTeam.leaderIndex
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {participant.name}
                                {index === selectedTeam.leaderIndex &&
                                  " (Lead)"}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Repository</h4>
                        <a
                          href={selectedTeam.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedTeam.githubRepo}
                        </a>
                      </div>

                      {/* Mock activity data for now */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <GitCommit className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">45</div>
                            <div className="text-sm text-muted-foreground">
                              Commits
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <GitBranch className="w-6 h-6 mx-auto mb-2 text-accent" />
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-sm text-muted-foreground">
                              Branches
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Activity className="w-6 h-6 mx-auto mb-2 text-secondary" />
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-sm text-muted-foreground">
                              Pushes
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-sm font-bold text-primary">
                              2 mins ago
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Last Activity
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scoring">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>
                        Submit Score for {selectedTeam.teamCode} -{" "}
                        {selectedTeam.teamName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="round">Round</Label>
                          <select
                            id="round"
                            value={selectedRound}
                            onChange={(e) => setSelectedRound(e.target.value)}
                            className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                          >
                            <option value="round1">Round 1</option>
                            <option value="round2">Round 2</option>
                            <option value="final">Final Round</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="judge">Judge Name</Label>
                          <Input
                            id="judge"
                            value={judgeName}
                            onChange={(e) => setJudgeName(e.target.value)}
                            placeholder="Enter judge name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="score">Score (0-100)</Label>
                          <Input
                            id="score"
                            type="number"
                            min="0"
                            max="100"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="Enter score"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                          id="remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Enter detailed feedback and remarks..."
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={handleSubmitScore}
                        variant="hero"
                        className="w-full"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Submit Score
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>
                        Score History for {selectedTeam.teamCode} -{" "}
                        {selectedTeam.teamName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!selectedTeam.scores ||
                        Object.keys(selectedTeam.scores).length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No scores submitted yet
                          </p>
                        ) : (
                          Object.entries(selectedTeam.scores).map(
                            ([round, scoreData]) =>
                              scoreData && scoreData.score ? (
                                <Card key={round}>
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold">
                                        {getRoundDisplayName(round)}
                                      </h4>
                                      <Badge
                                        variant="default"
                                        className="text-lg px-3"
                                      >
                                        {scoreData.score}/100
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      Judge: {scoreData.judge}
                                    </p>
                                    <p className="text-sm">
                                      {scoreData.remarks}
                                    </p>
                                  </CardContent>
                                </Card>
                              ) : null
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Scale className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Team Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a team from the list to view details and submit
                    scores
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgePanel;
