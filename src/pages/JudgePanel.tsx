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
  Play,
  ExternalLink,
  Clock,
  User,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamRegistration } from "@/lib/mockBackend"; // Using the same type

// GitHub API types
interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

interface RepoStats {
  commits: number;
  branches: number;
  lastActivity: string;
  contributors: number;
}

const JudgePanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [domains, setDomains] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(
    null
  );
  const [selectedRound, setSelectedRound] = useState<string>("round1");
  const [score, setScore] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [judgeName, setJudgeName] = useState<string>("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loadingRepoData, setLoadingRepoData] = useState<boolean>(false);
  const { toast } = useToast();

  const API_URL = "https://hackabhigna-hub.onrender.com";

  const loadDomains = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/domain-settings`);
      if (!response.ok) throw new Error("Failed to fetch domains");
      const data: {
        domain: string;
        maxSlots: number;
        paused: boolean;
        slotsLeft: number;
      }[] = await response.json();
      const domainOptions = data.map((d) => ({
        value: d.domain,
        label: d.domain,
      }));
      setDomains(domainOptions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    }
  }, [toast]);

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

  // GitHub API functions
  const fetchRepoCommits = useCallback(
    async (repoName: string) => {
      if (!repoName) return;

      setLoadingRepoData(true);
      try {
        const response = await fetch(
          `https://api.github.com/repos/${process.env.VITE_GITHUB_OWNER}/${repoName}/commits?per_page=10`,
          {
            headers: {
              Authorization: `token ${process.env.VITE_GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const commitsData: GitHubCommit[] = await response.json();
        setCommits(commitsData);
      } catch (error) {
        console.error("Error fetching commits:", error);
        toast({
          variant: "destructive",
          title: "GitHub Error",
          description: "Failed to fetch repository commits",
        });
      } finally {
        setLoadingRepoData(false);
      }
    },
    [toast]
  );

  const fetchRepoStats = useCallback(async (repoName: string) => {
    if (!repoName) return;

    try {
      // Fetch repository info
      const repoResponse = await fetch(
        `https://api.github.com/repos/${process.env.VITE_GITHUB_OWNER}/${repoName}`,
        {
          headers: {
            Authorization: `token ${process.env.VITE_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      // Fetch branches
      const branchesResponse = await fetch(
        `https://api.github.com/repos/${process.env.VITE_GITHUB_OWNER}/${repoName}/branches`,
        {
          headers: {
            Authorization: `token ${process.env.VITE_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      // Fetch contributors
      const contributorsResponse = await fetch(
        `https://api.github.com/repos/${process.env.VITE_GITHUB_OWNER}/${repoName}/contributors`,
        {
          headers: {
            Authorization: `token ${process.env.VITE_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (repoResponse.ok && branchesResponse.ok && contributorsResponse.ok) {
        const repoData = await repoResponse.json();
        const branchesData = await branchesResponse.json();
        const contributorsData = await contributorsResponse.json();

        setRepoStats({
          commits: 0, // Will be updated from commits API
          branches: branchesData.length,
          lastActivity: repoData.updated_at,
          contributors: contributorsData.length,
        });
      }
    } catch (error) {
      console.error("Error fetching repo stats:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDomains();
      loadApprovedTeams();
    }
  }, [isAuthenticated, loadDomains, loadApprovedTeams]);

  // Load GitHub data when team is selected
  useEffect(() => {
    if (selectedTeam && selectedTeam.githubRepo) {
      const repoName =
        selectedTeam.githubRepo.split("/").pop() || selectedTeam.teamCode;
      fetchRepoCommits(repoName);
      fetchRepoStats(repoName);
    }
  }, [selectedTeam, fetchRepoCommits, fetchRepoStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
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

      loadApprovedTeams();
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
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <div className="space-y-6">
                    {/* Team Info Card */}
                    <Card className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Github className="w-5 h-5" />
                              {selectedTeam.teamCode} - {selectedTeam.teamName}
                            </CardTitle>
                            <Badge variant="outline" className="mt-2">
                              {selectedTeam.domain}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const repoName =
                                selectedTeam.githubRepo?.split("/").pop() ||
                                selectedTeam.teamCode;
                              fetchRepoCommits(repoName);
                              fetchRepoStats(repoName);
                            }}
                            disabled={loadingRepoData}
                          >
                            <RefreshCw
                              className={`w-4 h-4 mr-2 ${
                                loadingRepoData ? "animate-spin" : ""
                              }`}
                            />
                            Refresh
                          </Button>
                        </div>
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

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold mb-2">Repository</h4>
                            <a
                              href={`https://github.com/${
                                process.env.VITE_GITHUB_OWNER
                              }/${
                                selectedTeam.githubRepo?.split("/").pop() ||
                                selectedTeam.teamCode
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-2"
                            >
                              <Github className="w-4 h-4" />
                              {process.env.VITE_GITHUB_OWNER}/
                              {selectedTeam.githubRepo?.split("/").pop() ||
                                selectedTeam.teamCode}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const repoUrl = `https://github.com/${
                                  process.env.VITE_GITHUB_OWNER
                                }/${
                                  selectedTeam.githubRepo?.split("/").pop() ||
                                  selectedTeam.teamCode
                                }`;
                                window.open(repoUrl, "_blank");
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Repo
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                const repoUrl = `https://${
                                  process.env.VITE_GITHUB_OWNER
                                }.github.io/${
                                  selectedTeam.githubRepo?.split("/").pop() ||
                                  selectedTeam.teamCode
                                }`;
                                window.open(repoUrl, "_blank");
                              }}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Run Project
                            </Button>
                          </div>
                        </div>

                        {/* Repository Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <GitCommit className="w-6 h-6 mx-auto mb-2 text-primary" />
                              <div className="text-2xl font-bold">
                                {loadingRepoData ? "..." : commits.length}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Recent Commits
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <GitBranch className="w-6 h-6 mx-auto mb-2 text-accent" />
                              <div className="text-2xl font-bold">
                                {loadingRepoData
                                  ? "..."
                                  : repoStats?.branches || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Branches
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <User className="w-6 h-6 mx-auto mb-2 text-secondary" />
                              <div className="text-2xl font-bold">
                                {loadingRepoData
                                  ? "..."
                                  : repoStats?.contributors || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Contributors
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                              <div className="text-sm font-bold text-primary">
                                {loadingRepoData
                                  ? "..."
                                  : repoStats?.lastActivity
                                  ? new Date(
                                      repoStats.lastActivity
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Last Activity
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Commits Card */}
                    <Card className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GitCommit className="w-5 h-5" />
                          Recent Commits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loadingRepoData ? (
                          <div className="text-center py-8">
                            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
                            <p className="text-muted-foreground">
                              Loading commits...
                            </p>
                          </div>
                        ) : commits.length === 0 ? (
                          <div className="text-center py-8">
                            <GitCommit className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              No commits found
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {commits.slice(0, 5).map((commit) => (
                              <div
                                key={commit.sha}
                                className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  {commit.author?.avatar_url ? (
                                    <img
                                      src={commit.author.avatar_url}
                                      alt={commit.author.login}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground mb-1">
                                    {commit.commit.message.split("\n")[0]}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>{commit.commit.author.name}</span>
                                    <span>
                                      {new Date(
                                        commit.commit.author.date
                                      ).toLocaleString()}
                                    </span>
                                    <span className="font-mono">
                                      {commit.sha.substring(0, 7)}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const commitUrl = `https://github.com/${
                                      process.env.VITE_GITHUB_OWNER
                                    }/${
                                      selectedTeam.githubRepo
                                        ?.split("/")
                                        .pop() || selectedTeam.teamCode
                                    }/commit/${commit.sha}`;
                                    window.open(commitUrl, "_blank");
                                  }}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
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
