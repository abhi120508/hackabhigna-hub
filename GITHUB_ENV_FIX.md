# GitHub Environment Variables Fix

## Problem
The GitHub API is not fetching commits and repository data because the environment variables are not being passed to the frontend correctly.

## Root Cause
- **Vite only exposes environment variables that start with `VITE_`** to the frontend
- Your Render environment has `GITHUB_OWNER` and `GITHUB_TOKEN` (without the `VITE_` prefix)
- The frontend code is looking for `VITE_GITHUB_OWNER` and `VITE_GITHUB_TOKEN`

## Solution

### Step 1: Update Render Environment Variables

In your Render dashboard, you need to add/update these environment variables:

**For the Frontend (Vite build):**
- `VITE_GITHUB_OWNER` = `hackabhigna2025-hub`
- `VITE_GITHUB_TOKEN` = `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5`

**For the Backend (Node.js):**
- `GITHUB_OWNER` = `hackabhigna2025-hub`
- `GITHUB_TOKEN` = `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5`

### Step 2: Update render.yaml

Add the GitHub variables to the render.yaml file:

```yaml
envVars:
  - key: VITE_GITHUB_OWNER
    sync: false
  - key: VITE_GITHUB_TOKEN
    sync: false
  - key: GITHUB_OWNER
    sync: false
  - key: GITHUB_TOKEN
    sync: false
```

### Step 3: Redeploy

After updating the environment variables in Render:
1. Go to your Render dashboard
2. Trigger a new deployment
3. Wait for the build to complete
4. Test the GitHub data fetching

## How It Works Now

The code has been updated to:
1. Try `VITE_GITHUB_TOKEN` first (for frontend)
2. Fall back to `GITHUB_TOKEN` if not found
3. Same for `VITE_GITHUB_OWNER` and `GITHUB_OWNER`
4. Log which variable is being used for debugging

## Verification

After deployment, check the browser console (F12 → Console tab) for logs like:
- `"Using VITE_GITHUB_TOKEN"`
- `"Using VITE_GITHUB_OWNER: hackabhigna2025-hub"`
- `"Fetched X commits for owner/repo"`

If you see "No GitHub token found in environment variables", the variables are still not set correctly.

