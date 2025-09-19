import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Trophy, GitCommit, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamRegistration } from "@/lib/mockBackend"; // Using the shared interface

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
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Your Team's Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Team Members</h4>
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
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Repository</h4>
                  <a
                    href={teamData.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {teamData.githubRepo}
                  </a>
                </div>
              </CardContent>
            </Card>
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
