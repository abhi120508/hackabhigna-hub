# GitHub Integration Setup Checklist

## ✅ Code Changes (Already Done)

- [x] Updated `useGitHubData.ts` with fallback environment variable handling
- [x] Updated `JudgePanel.tsx` to use fallback logic
- [x] Updated `ParticipantPanel.tsx` to use fallback logic
- [x] Added comprehensive logging for debugging
- [x] Fixed commit count calculation (was hardcoded to 0)
- [x] Updated `render.yaml` to include GitHub environment variables

## 🔧 Render Dashboard Configuration (YOU NEED TO DO THIS)

### Step 1: Add Environment Variables in Render Dashboard

Go to your Render service settings and add these environment variables:

```
VITE_GITHUB_OWNER = hackabhigna2025-hub
VITE_GITHUB_TOKEN = ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
GITHUB_OWNER = hackabhigna2025-hub
GITHUB_TOKEN = ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
```

**Important:** Make sure you have BOTH:
- `VITE_` prefixed versions (for frontend/Vite)
- Non-prefixed versions (for backend/Node.js)

### Step 2: Trigger Redeploy

1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" or push to your repository
4. Wait for build to complete

### Step 3: Verify in Browser

1. Open your application in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these success messages:
   - `✓ GitHub token configured: ghp_8aFXxU...`
   - `✓ GitHub owner configured: hackabhigna2025-hub`
   - `Fetched X commits for owner/repo`

### Step 4: Test GitHub Data Fetching

1. Go to Judge Panel or Participant Panel
2. Select a team
3. Click "Refresh" button
4. Check if commits, branches, and contributors appear

## 🐛 Troubleshooting

### If you see: "No GitHub token found in environment variables"
- The environment variables are not set in Render
- Go back to Step 1 and add them

### If you see: "GitHub API error: 401"
- The token is invalid or expired
- Generate a new GitHub Personal Access Token with `repo` scope

### If you see: "GitHub API error: 404"
- The repository doesn't exist
- Check that `VITE_GITHUB_OWNER` matches your GitHub organization

### If commits still show as empty
- Check browser console for errors
- Verify the repository has commits
- Try clicking Refresh button

## 📝 Notes

- The GitHub token needs `repo` scope to access private repositories
- Tokens are sensitive - never commit them to version control
- The token is only used on the frontend for API calls to GitHub
- All API calls are made directly from the browser to GitHub API

