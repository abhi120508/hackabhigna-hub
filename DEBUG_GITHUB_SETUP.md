# Debug GitHub Setup - Complete Guide

## Quick Diagnosis

### Step 1: Check Backend Environment Variables

Open this URL in your browser (replace with your Render URL):
```
https://hackabhigna-hub.onrender.com/debug/env
```

You should see something like:
```json
{
  "nodeEnv": "production",
  "github": {
    "GITHUB_OWNER": "✓ Set",
    "GITHUB_TOKEN": "✓ Set (length: 40)",
    "VITE_GITHUB_OWNER": "✓ Set",
    "VITE_GITHUB_TOKEN": "✓ Set (length: 40)"
  },
  "other": {
    "ATLAS_URI": "✓ Set",
    "SENDGRID_API_KEY": "✓ Set",
    "CLOUDINARY_CLOUD_NAME": "✓ Set"
  }
}
```

**If you see "✗ Not set" for any GitHub variables, they are not configured in Render.**

### Step 2: Check Frontend Console

1. Open your application in browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these messages:

**Good signs:**
```
✓ GitHub token configured: ghp_8aFXxU...
✓ GitHub owner configured: hackabhigna2025-hub
Fetched 10 commits for hackabhigna2025-hub/SMTH059
Repo stats: branches=2, contributors=3
```

**Bad signs:**
```
✗ GitHub token NOT configured - GitHub API calls will fail
✗ Make sure VITE_GITHUB_TOKEN is set in environment variables
```

## Solution: Add Environment Variables to Render

### The Problem
- Vite only exposes variables with `VITE_` prefix to frontend
- Your Render dashboard has `GITHUB_OWNER` and `GITHUB_TOKEN` (without prefix)
- Frontend can't access them

### The Fix

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Select your service

2. **Go to Settings → Environment**

3. **Add 4 Variables:**

   | Key | Value |
   |-----|-------|
   | `VITE_GITHUB_OWNER` | `hackabhigna2025-hub` |
   | `VITE_GITHUB_TOKEN` | `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5` |
   | `GITHUB_OWNER` | `hackabhigna2025-hub` |
   | `GITHUB_TOKEN` | `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5` |

4. **Redeploy**
   - Go to Deployments tab
   - Click "Manual Deploy"
   - Wait for build to complete

5. **Verify**
   - Check `/debug/env` endpoint
   - Check browser console
   - Select a team and click Refresh

## Why This Matters

- **VITE_ prefix**: Required for Vite to expose to frontend JavaScript
- **Non-prefixed**: For backend Node.js if needed
- **Both needed**: Frontend and backend may need them

## Troubleshooting

### Still seeing "GitHub token NOT configured"?

1. **Check Render Dashboard**
   - Are the variables actually saved?
   - Did you click Save after adding them?

2. **Check Deployment**
   - Did the redeploy complete successfully?
   - Check deployment logs for errors

3. **Clear Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Open in incognito window
   - Clear browser cache

4. **Check Token**
   - Is the token valid?
   - Does it have `repo` scope?
   - Is it expired?

### Getting "GitHub API error: 401"?
- Token is invalid or expired
- Generate new token on GitHub with `repo` scope

### Getting "GitHub API error: 404"?
- Repository doesn't exist
- Check `VITE_GITHUB_OWNER` value

## Files Modified

- `render.yaml` - Added GitHub variables to config
- `server/server.js` - Added `/debug/env` endpoint
- `src/hooks/useGitHubData.ts` - Added fallback logic and logging
- `src/pages/JudgePanel.tsx` - Updated to use fallback logic
- `src/pages/ParticipantPanel.tsx` - Updated to use fallback logic

## Next Steps

1. Add the 4 environment variables to Render
2. Trigger a redeploy
3. Check `/debug/env` endpoint
4. Check browser console
5. Test by selecting a team and clicking Refresh

