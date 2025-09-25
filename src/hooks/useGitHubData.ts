import { useState, useCallback } from "react";
import type {
  GitHubCommit,
  RepoStats,
  GitHubError,
  GitHubData,
} from "@/lib/types/github";

const GITHUB_API_BASE = "https://api.github.com/repos";

interface UseGitHubDataParams {
  owner: string;
  token: string;
}

export function useGitHubData({ owner, token }: UseGitHubDataParams) {
  const [data, setData] = useState<GitHubData>({
    commits: [],
    repoStats: null,
    loading: false,
    error: null,
  });

  const fetchRepoCommits = useCallback(
    async ({
      owner: repoOwner,
      repoName,
    }: {
      owner: string;
      repoName: string;
    }) => {
      if (!repoName || !repoOwner) return;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch(
          `${GITHUB_API_BASE}/${repoOwner}/${repoName}/commits?per_page=10`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const commitsData: GitHubCommit[] = await response.json();
        setData((prev) => ({ ...prev, commits: commitsData, loading: false }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch commits";
        setData((prev) => ({
          ...prev,
          loading: false,
          error: {
            type: "API_ERROR",
            message,
          },
        }));
      }
    },
    [token]
  );

  const fetchRepoStats = useCallback(
    async ({
      owner: repoOwner,
      repoName,
    }: {
      owner: string;
      repoName: string;
    }) => {
      if (!repoName || !repoOwner) return;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const repoResponse = await fetch(
          `${GITHUB_API_BASE}/${repoOwner}/${repoName}`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const branchesResponse = await fetch(
          `${GITHUB_API_BASE}/${repoOwner}/${repoName}/branches`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const contributorsResponse = await fetch(
          `${GITHUB_API_BASE}/${repoOwner}/${repoName}/contributors`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (repoResponse.ok && branchesResponse.ok && contributorsResponse.ok) {
          const repoData = await repoResponse.json();
          const branchesData = await branchesResponse.json();
          const contributorsData = await contributorsResponse.json();

          setData((prev) => ({
            ...prev,
            repoStats: {
              commits: 0,
              branches: branchesData.length,
              lastActivity: repoData.updated_at,
              contributors: contributorsData.length,
            },
            loading: false,
          }));
        } else {
          throw new Error("Failed to fetch repo stats");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch repo stats";
        setData((prev) => ({
          ...prev,
          loading: false,
          error: {
            type: "API_ERROR",
            message,
          },
        }));
      }
    },
    [token]
  );

  return {
    data,
    fetchRepoCommits,
    fetchRepoStats,
  };
}
