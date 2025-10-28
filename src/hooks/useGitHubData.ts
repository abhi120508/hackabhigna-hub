import { useState, useCallback, useEffect } from "react";
import type { GitHubCommit, GitHubData } from "@/lib/types/github";

// Use backend API endpoint instead of calling GitHub directly
const BACKEND_API_BASE = "https://hackabhigna-hub.onrender.com";
const GITHUB_API_ENDPOINT = `${BACKEND_API_BASE}/api/github/repo-stats`;

// Normalize owner and repoName from various inputs (owner + repoName OR full repo URL OR owner/repo)
function parseOwnerAndRepo(ownerIn: string, repoIn: string) {
  let owner = ownerIn || "";
  let repoName = repoIn || "";

  // If repoIn looks like a full url like https://github.com/owner/repo or git@github.com:owner/repo.git
  if (
    repoName &&
    (repoName.startsWith("http") || repoName.includes("github.com"))
  ) {
    try {
      // Handle http(s) urls
      if (repoName.startsWith("http")) {
        const parts = repoName.split("/").filter(Boolean);
        const idx = parts.findIndex((p) => p.includes("github.com"));
        if (idx >= 0 && parts.length > idx + 1) {
          owner = parts[idx + 1];
          repoName = parts[idx + 2] || repoName;
        }
      } else {
        // handle git@github.com:owner/repo.git or other forms by splitting on : or /
        const parts = repoName.split(new RegExp("[:/]+")).filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[parts.length - 2];
          repoName = parts[parts.length - 1];
        }
      }
    } catch (e) {
      // fallback to provided values
    }
  }

  // If repoName contains owner/repo format
  if (!owner && repoName && repoName.includes("/")) {
    const parts = repoName.split("/");
    owner = parts[0];
    repoName = parts[1];
  }

  // strip .git suffix
  if (repoName && repoName.endsWith(".git")) {
    repoName = repoName.slice(0, -4);
  }

  return { owner, repoName };
}

interface UseGitHubDataParams {
  owner: string;
}

export function useGitHubData({ owner }: UseGitHubDataParams) {
  const [data, setData] = useState<GitHubData>({
    commits: [],
    repoStats: null,
    loading: false,
    error: null,
  });

  // Debug: Log when token changes
  useEffect(() => {
    console.log("✓ GitHub integration configured (using backend API)");
  }, [owner]);

  const fetchRepoCommits = useCallback(
    async ({
      owner: repoOwner,
      repoName,
    }: {
      owner: string;
      repoName: string;
    }) => {
      if (!repoName && !repoOwner) return;
      const parsed = parseOwnerAndRepo(repoOwner, repoName);
      const finalOwner = parsed.owner || repoOwner;
      const finalRepo = parsed.repoName || repoName;
      if (!finalOwner || !finalRepo) return;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        // Call backend endpoint instead of GitHub API directly
        const response = await fetch(
          `${GITHUB_API_ENDPOINT}?owner=${finalOwner}&repo=${finalRepo}`
        );
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          console.error(`Backend API error: ${response.status}`, body);
          throw new Error(
            `Backend API error: ${response.status} ${body.error || ""}`
          );
        }
        const data = await response.json();
        const commitsData: GitHubCommit[] = data.commits || [];
        console.log(
          `Fetched ${commitsData.length} commits for ${finalOwner}/${finalRepo}`
        );
        setData((prev) => ({ ...prev, commits: commitsData, loading: false }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch commits";
        console.error("Commit fetch error:", message);
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
    []
  );

  const fetchRepoStats = useCallback(
    async ({
      owner: repoOwner,
      repoName,
    }: {
      owner: string;
      repoName: string;
    }) => {
      if (!repoName && !repoOwner) return;
      const parsed = parseOwnerAndRepo(repoOwner, repoName);
      const finalOwner = parsed.owner || repoOwner;
      const finalRepo = parsed.repoName || repoName;
      if (!finalOwner || !finalRepo) return;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        console.log(`Fetching stats for ${finalOwner}/${finalRepo}`);
        // Call backend endpoint instead of GitHub API directly
        const response = await fetch(
          `${GITHUB_API_ENDPOINT}?owner=${finalOwner}&repo=${finalRepo}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            `Failed to fetch repo stats: ${response.status}`,
            errorData
          );
          throw new Error(
            `Failed to fetch repo stats: ${response.status} - ${
              errorData.error || ""
            }`
          );
        }

        const data = await response.json();
        const branchesData = data.branches || [];
        const contributorsData = data.contributors || [];
        const repoData = data.repo || {};

        console.log(
          `Repo stats: branches=${branchesData.length}, contributors=${contributorsData.length}`
        );
        setData((prev) => ({
          ...prev,
          repoStats: {
            commits: prev.commits.length,
            branches: branchesData.length,
            lastActivity: repoData.updated_at,
            contributors: contributorsData.length,
          },
          loading: false,
        }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch repo stats";
        console.error("Repo stats fetch error:", message);
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
    []
  );

  return {
    data,
    fetchRepoCommits,
    fetchRepoStats,
  };
}
