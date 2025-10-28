import { useState, useCallback, useEffect } from "react";
import type {
  GitHubCommit,
  RepoStats,
  GitHubError,
  GitHubData,
} from "@/lib/types/github";

const GITHUB_API_BASE = "https://api.github.com/repos";

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
  token: string;
}

export function useGitHubData({ owner, token }: UseGitHubDataParams) {
  const [data, setData] = useState<GitHubData>({
    commits: [],
    repoStats: null,
    loading: false,
    error: null,
  });

  // Debug: Log when token changes
  useEffect(() => {
    if (token) {
      console.log("GitHub token configured:", token.substring(0, 10) + "...");
    } else {
      console.warn("GitHub token not configured");
    }
  }, [token]);

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
        // Try to fetch commits from the default branch
        const response = await fetch(
          `${GITHUB_API_BASE}/${finalOwner}/${finalRepo}/commits?per_page=10`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (!response.ok) {
          const body = await response.text().catch(() => "");
          console.error(`GitHub API error: ${response.status}`, body);
          throw new Error(`GitHub API error: ${response.status} ${body}`);
        }
        const commitsData: GitHubCommit[] = await response.json();
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
      if (!repoName && !repoOwner) return;
      const parsed = parseOwnerAndRepo(repoOwner, repoName);
      const finalOwner = parsed.owner || repoOwner;
      const finalRepo = parsed.repoName || repoName;
      if (!finalOwner || !finalRepo) return;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        console.log(`Fetching stats for ${finalOwner}/${finalRepo}`);
        const repoResponse = await fetch(
          `${GITHUB_API_BASE}/${finalOwner}/${finalRepo}`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const branchesResponse = await fetch(
          `${GITHUB_API_BASE}/${finalOwner}/${finalRepo}/branches`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const contributorsResponse = await fetch(
          `${GITHUB_API_BASE}/${finalOwner}/${finalRepo}/contributors`,
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
        } else {
          const bodies = await Promise.all([
            repoResponse.text().catch(() => ""),
            branchesResponse.text().catch(() => ""),
            contributorsResponse.text().catch(() => ""),
          ]);
          console.error(
            `Failed to fetch repo stats: ${repoResponse.status}, ${branchesResponse.status}, ${contributorsResponse.status}`
          );
          throw new Error(
            `Failed to fetch repo stats: ${repoResponse.status}, ${
              branchesResponse.status
            }, ${contributorsResponse.status} - ${bodies.join(" | ")}`
          );
        }
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
    [token]
  );

  return {
    data,
    fetchRepoCommits,
    fetchRepoStats,
  };
}
