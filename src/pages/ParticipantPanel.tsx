import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Trophy,
  GitCommit,
  Users,
  Activity,
  Github,
  GitBranch,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamRegistration } from "@/lib/mockBackend"; // Using the shared interface

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

interface LeaderboardItem {
  teamName: string;
  domain: string;
  totalScore: number;
  teamCode: string;
}

const ParticipantPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const [email, setEmail] = useState("");
  const [teamData, setTeamData] = useState<TeamRegistration | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [globalSettings, setGlobalSettings] = useState({
    pausedLeaderboard: false,
  });
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [loadingRepoData, setLoadingRepoData] = useState<boolean>(false);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`${API_URL}/global-settings`);
          setGlobalSettings(response.data);
          if (!response.data.pausedLeaderboard && teamData) {
            const lbResponse = await axios.get(`${API_URL}/leaderboard`);
            // Filter leaderboard to only include teams in the same domain as the logged-in team
            const domainLeaderboard = lbResponse.data.filter(
              (item: LeaderboardItem) => item.domain === teamData.domain
            );
            setLeaderboard(domainLeaderboard);
          }
        } catch (error) {
          console.error("Error fetching settings or leaderboard", error);
        }
      };
      fetchSettings();

      // Setup polling to fetch global settings every 10 seconds for real-time pause updates
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${API_URL}/global-settings`);
          setGlobalSettings(response.data);
        } catch (error) {
          console.error("Error fetching global settings during polling", error);
        }
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, API_URL, teamData]);

  // Load GitHub data when team is selected
  const fetchRepoCommits = useCallback(
    async (repoName: string) => {
      if (!repoName) return;

      setLoadingRepoData(true);
      try {
        const response = await fetch(
          `https://api.github.com/repos/${
            import.meta.env.VITE_GITHUB_OWNER
          }/${repoName}/commits?per_page=10`,
          {
            headers: {
              Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
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
    if (teamData && teamData.githubRepo) {
      const repoName =
        teamData.githubRepo.split("/").pop() || teamData.teamCode;
      fetchRepoCommits(repoName);
      fetchRepoStats(repoName);
    }
  }, [teamData, fetchRepoCommits, fetchRepoStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !uniqueId) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and unique ID.",
      });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/login/participant`, {
        email,
        uniqueId,
      });

      setIsAuthenticated(true);
      setTeamData(response.data.data);
      toast({
        title: "Login Successful",
        description: `Welcome, ${response.data.data.teamName}!`,
      });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dark min-h-screen flex items-center justify-center pt-16 bg-black">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Participant Login</CardTitle>
            <p className="text-muted-foreground">
              Access your team's dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Team Lead's Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter team lead's email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unique-id">Unique Team ID</Label>
                <Input
                  id="unique-id"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  placeholder="Enter your unique team ID"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This ID was sent to your team lead's email after approval.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
              >
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Loading team data...</p>
        </div>
      </div>
    );
  }

  const leader = teamData.participants[teamData.leaderIndex];
  const allMembers = teamData.participants;

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                {teamData.teamName}
              </h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{teamData.domain}</Badge>
              </div>
            </div>
            <div className="text-right"></div>
          </div>
        </div>

        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scores">Scores & Feedback</TabsTrigger>
            <TabsTrigger value="activity">Team & Repo</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="scores">
            <div className="space-y-6">
              {!teamData.scores ||
              Object.values(teamData.scores).every((s) => !s) ? (
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Scores Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Scores and feedback will appear here after judging rounds.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(teamData.scores).map(([round, scoreData]) =>
                  scoreData && scoreData.score ? (
                    <Card key={round} className="bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            {round.charAt(0).toUpperCase() + round.slice(1)}
                          </CardTitle>
                          <Badge
                            variant="default"
                            className="text-lg px-4 py-1"
                          >
                            {scoreData.score}/100
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Judge Feedback</h4>
                          <p className="text-muted-foreground">
                            {scoreData.remarks}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Evaluated by: {scoreData.judge}
                        </div>
                      </CardContent>
                    </Card>
                  ) : null
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="space-y-6">
              {/* Team Members */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allMembers.map((participant, index) => (
                      <Badge
                        key={index}
                        variant={
                          participant.email === leader.email
                            ? "default"
                            : "secondary"
                        }
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {participant.name}
                        {participant.email === leader.email && " (Lead)"}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Repository Activity */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Github className="w-5 h-5" />
                      Repository Activity
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(teamData.githubRepo, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Repo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const repoName =
                            teamData.githubRepo.split("/").pop() ||
                            teamData.teamCode;
                          window.open(
                            `${process.env.VITE_PROJECT_RUN_URL}/${repoName}`,
                            "_blank"
                          );
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Run Project
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingRepoData ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p>Loading repository data...</p>
                    </div>
                  ) : (
                    <>
                      {/* Repository Stats */}
                      {repoStats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <GitCommit className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {commits.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Commits
                            </div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <GitBranch className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {repoStats.branches}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Branches
                            </div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {repoStats.contributors}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Contributors
                            </div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-bold">
                              {new Date(
                                repoStats.lastActivity
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Last Activity
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recent Commits */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <GitCommit className="w-4 h-4" />
                          Recent Commits
                        </h4>
                        {commits.length > 0 ? (
                          <div className="space-y-3">
                            {commits.slice(0, 5).map((commit) => (
                              <div
                                key={commit.sha}
                                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  {commit.author?.avatar_url ? (
                                    <img
                                      src={commit.author.avatar_url}
                                      alt={commit.author.login}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {commit.commit.message}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span>
                                      {commit.author?.login ||
                                        commit.commit.author.name}
                                    </span>
                                    <span>•</span>
                                    <span>
                                      {new Date(
                                        commit.commit.author.date
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <GitCommit className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No commits found</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Live Leaderboard
                </CardTitle>
                <p className="text-muted-foreground">
                  Current standings of all teams.
                </p>
              </CardHeader>
              <CardContent>
                {globalSettings.pausedLeaderboard ? (
                  <p className="text-center text-muted-foreground">
                    Leaderboard is currently paused.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((item, index) => (
                      <div
                        key={item.teamCode}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant={index < 3 ? "default" : "secondary"}>
                            {index + 1}
                          </Badge>
                          <div>
                            <p className="font-semibold">{item.teamName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.domain}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{item.totalScore}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParticipantPanel;
