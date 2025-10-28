# Repository Activation Troubleshooting Guide

## Problem: "Activation Failed - Something went wrong"

When scanning a QR code and clicking "Activate Repository", you get an error message.

## Root Causes & Solutions

### 1. **GitHub Token Not Set or Invalid** ❌

**Error Message:** 
- "GitHub token not configured on server"
- "GitHub authentication failed"
- "Invalid or expired GitHub token"

**Solution:**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your service (hackabhigna-backend)
3. Go to **Settings** → **Environment**
4. Check if `GITHUB_TOKEN` exists
5. If missing or invalid:
   - Generate a new token on [GitHub Settings](https://github.com/settings/tokens)
   - Create a **Personal Access Token** with `repo` scope
   - Copy the token
   - Update `GITHUB_TOKEN` in Render environment
   - Trigger a manual redeploy

### 2. **GitHub Owner Not Set** ❌

**Error Message:**
- "GitHub owner not configured on server"

**Solution:**
1. Go to Render Dashboard → Settings → Environment
2. Add `GITHUB_OWNER` = `hackabhigna2025-hub`
3. Trigger a manual redeploy

### 3. **Repository Doesn't Exist** ❌

**Error Message:**
- "Repository or user not found on GitHub"
- "Could not find repository 'TEAMCODE' under owner 'hackabhigna2025-hub'"

**Possible Causes:**
- Repository wasn't created when team was approved
- Repository was deleted
- Team code doesn't match repository name

**Solution:**
1. Check if repository exists: `https://github.com/hackabhigna2025-hub/TEAMCODE`
2. If missing, manually create it or re-approve the team
3. Ensure team code matches repository name

### 4. **Team Code Not Found** ❌

**Error Message:**
- "Team with code 'TEAMCODE' not found"

**Solution:**
1. Verify the QR code is correct
2. Check that the team was approved in Admin Panel
3. Ensure team code is in the database

### 5. **Invalid GitHub Repository URL** ❌

**Error Message:**
- "Invalid GitHub repository URL"

**Solution:**
1. Check team's `gitRepo` field in database
2. Ensure it's a valid GitHub URL format: `https://github.com/username/repo`

## How to Debug

### Step 1: Check Browser Console
1. Open the QR Panel
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to activate a repository
5. Look for error messages in the console
6. Copy the full error and check against solutions above

### Step 2: Check Server Logs
1. Go to Render Dashboard
2. Select your service
3. Go to **Logs** tab
4. Look for messages starting with:
   - ❌ (error)
   - 🔍 (info)
   - ✅ (success)

### Step 3: Verify Environment Variables
```bash
# In Render Dashboard, check these are set:
GITHUB_TOKEN=ghp_xxxxx...
GITHUB_OWNER=hackabhigna2025-hub
ATLAS_URI=mongodb+srv://...
```

## Quick Checklist

- [ ] `GITHUB_TOKEN` is set in Render environment
- [ ] `GITHUB_OWNER` is set to `hackabhigna2025-hub`
- [ ] GitHub token has `repo` scope
- [ ] GitHub token is not expired
- [ ] Repository exists on GitHub
- [ ] Team is approved in Admin Panel
- [ ] Team code matches repository name
- [ ] Server was redeployed after env changes

## Still Not Working?

1. **Hard refresh browser:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache:** Settings → Clear browsing data
3. **Check deployment status:** Render Dashboard → Deployments
4. **Wait 5 minutes:** Sometimes changes take time to propagate
5. **Contact support:** Share the error message from browser console

## Example Error Responses

### 401 Unauthorized
```json
{
  "message": "GitHub authentication failed",
  "error": "Invalid or expired GitHub token. Please update GITHUB_TOKEN in environment variables.",
  "details": { "message": "Bad credentials" }
}
```
**Fix:** Regenerate GitHub token

### 404 Not Found
```json
{
  "message": "Repository or user not found on GitHub",
  "error": "Could not find repository 'SMCE006' under owner 'hackabhigna2025-hub' or user 'abhishek'",
  "details": { "message": "Not Found" }
}
```
**Fix:** Create the repository or check team code

### 422 Unprocessable Entity
```json
{
  "message": "Invalid request to GitHub API",
  "error": "Repository or collaborator configuration is invalid",
  "details": { "message": "Validation Failed" }
}
```
**Fix:** Check repository settings and collaborator permissions

