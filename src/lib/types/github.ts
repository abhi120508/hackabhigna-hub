// Shared TypeScript interfaces for GitHub API operations
// Used by both JudgePanel and ParticipantPanel

export interface GitHubCommit {
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

export interface RepoStats {
  commits: number;
  branches: number;
  lastActivity: string;
  contributors: number;
}

export interface GitHubError {
  type: "API_ERROR" | "NETWORK_ERROR" | "AUTH_ERROR" | "NOT_FOUND";
  message: string;
  status?: number;
}

export interface GitHubData {
  commits: GitHubCommit[];
  repoStats: RepoStats | null;
  loading: boolean;
  error: GitHubError | null;
}
