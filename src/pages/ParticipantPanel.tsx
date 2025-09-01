import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Trophy, GitCommit, Users, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamData {
  id: string;
  name: string;
  domain: string;
  participants: string[];
  repository: string;
  activity: {
    commits: number;
    branches: number;
    pushes: number;
  };
  scores: Array<{
    round: string;
    score: number;
    maxScore: number;
    remarks: string;
    judge: string;
  }>;
  rank: number;
  totalScore: number;
}

interface LeaderboardEntry {
  rank: number;
  teamName: string;
  domain: string;
  totalScore: number;
  rounds: number;
}

// Mock data
const mockTeamData: TeamData = {
  id: "team-001",
  name: "Code Warriors",
  domain: "Web Development", 
  participants: ["John Doe", "Jane Smith", "Bob Wilson"],
  repository: "https://github.com/hackabhigna-org/team-001",
  activity: {
    commits: 45,
    branches: 3,
    pushes: 12
  },
  scores: [
    {
      round: "Round 1",
      score: 85,
      maxScore: 100,
      remarks: "Great initial implementation with clean code structure. Good use of modern React patterns.",
      judge: "Judge A"
    },
    {
      round: "Round 2", 
      score: 78,
      maxScore: 100,
      remarks: "Solid progress on features. Could improve on error handling and user experience.",
      judge: "Judge B"
    }
  ],
  rank: 3,
  totalScore: 163
};

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, teamName: "Innovation Squad", domain: "AI", totalScore: 185, rounds: 2 },
  { rank: 2, teamName: "Tech Titans", domain: "Mobile", totalScore: 172, rounds: 2 },
  { rank: 3, teamName: "Code Warriors", domain: "Web", totalScore: 163, rounds: 2 },
  { rank: 4, teamName: "Digital Wizards", domain: "Wildcard", totalScore: 158, rounds: 2 },
  { rank: 5, teamName: "Future Builders", domain: "AI", totalScore: 145, rounds: 2 }
];

const ParticipantPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - in real app, this would validate against backend
    if (uniqueId === "team-001-unique-id") {
      setIsAuthenticated(true);
      setTeamData(mockTeamData);
      toast({
        title: "Login Successful",
        description: `Welcome, ${mockTeamData.name}!`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed", 
        description: "Invalid unique ID"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-gradient">Participant Login</CardTitle>
            <p className="text-muted-foreground">Enter your unique team ID to access dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  This ID was sent to your team lead via email after QR approval
                </p>
              </div>
              <Button type="submit" className="w-full" variant="hero">
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

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Team Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">{teamData.name}</h1>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{teamData.domain}</Badge>
                <Badge variant="default" className="text-lg px-3">
                  Rank #{teamData.rank}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{teamData.totalScore}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scores">Scores & Feedback</TabsTrigger>
            <TabsTrigger value="activity">Repository Activity</TabsTrigger> 
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="scores">
            <div className="space-y-6">
              {teamData.scores.length === 0 ? (
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Scores Yet</h3>
                    <p className="text-muted-foreground">
                      Scores and feedback will appear here after judging rounds
                    </p>
                  </CardContent>
                </Card>
              ) : (
                teamData.scores.map((scoreData, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          {scoreData.round}
                        </CardTitle>
                        <Badge variant="default" className="text-lg px-4 py-1">
                          {scoreData.score}/{scoreData.maxScore}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Judge Feedback</h4>
                        <p className="text-muted-foreground">{scoreData.remarks}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Evaluated by: {scoreData.judge}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Your Team's Repository Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Team Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {teamData.participants.map((participant, index) => (
                      <Badge key={index} variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Repository</h4>
                  <a 
                    href={teamData.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {teamData.repository}
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Development Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <GitCommit className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold">{teamData.activity.commits}</div>
                        <div className="text-sm text-muted-foreground">Total Commits</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-accent" />
                        <div className="text-2xl font-bold">{teamData.activity.branches}</div>
                        <div className="text-sm text-muted-foreground">Branches</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 mx-auto mb-2 text-secondary" />
                        <div className="text-2xl font-bold">{teamData.activity.pushes}</div>
                        <div className="text-sm text-muted-foreground">Total Pushes</div>
                      </CardContent>
                    </Card>
                  </div>
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
                  Current standings based on cumulative scores
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((entry, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        entry.teamName === teamData.name 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-muted/20 border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1 ? 'bg-yellow-500 text-black' :
                          entry.rank === 2 ? 'bg-gray-400 text-black' :
                          entry.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <div className={`font-semibold ${
                            entry.teamName === teamData.name ? 'text-primary' : ''
                          }`}>
                            {entry.teamName}
                            {entry.teamName === teamData.name && (
                              <Badge variant="outline" className="ml-2">Your Team</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{entry.domain}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{entry.totalScore}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.rounds} rounds
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParticipantPanel;