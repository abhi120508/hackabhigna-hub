# 🚀 Deploy Frontend NOW - Quick Guide

## The Issue
Frontend is on GitHub Pages, not Render. Environment variables need to be set **during build**, not after.

## Solution: 3 Simple Steps

### Step 1: Open PowerShell in Your Project Folder

```powershell
cd d:\Desktop\safe3\hackabhigna-hub
```

### Step 2: Set Environment Variables

Copy and paste this entire block into PowerShell:

```powershell
$env:VITE_GITHUB_OWNER = "hackabhigna2025-hub"
$env:VITE_GITHUB_TOKEN = "ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5"
```

### Step 3: Build and Deploy

```powershell
npm run build
npm run deploy
```

That's it! ✅

## What Happens

1. **npm run build** - Creates production build with environment variables embedded
2. **npm run deploy** - Pushes to GitHub Pages
3. **Wait 30 seconds** - GitHub Pages updates
4. **Hard refresh browser** - Ctrl+Shift+R
5. **Check console** - Should see `✓ GitHub token configured`

## Verify It Works

1. Open your app in browser
2. Press F12 → Console
3. Look for: `✓ GitHub token configured: ghp_8aFXxU...`
4. Go to Judge Panel
5. Select a team
6. Click "Refresh"
7. Commits should appear ✅

## If Using Command Prompt Instead

```cmd
set VITE_GITHUB_OWNER=hackabhigna2025-hub
set VITE_GITHUB_TOKEN=ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
npm run build
npm run deploy
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Still seeing error | Hard refresh: Ctrl+Shift+R |
| Build fails | Check environment variables are set: `$env:VITE_GITHUB_OWNER` |
| Deploy fails | Make sure git is configured: `git config --global user.name "Name"` |
| Still no commits | Wait 1 minute, hard refresh, check console |

---

**Do this now and GitHub integration will work!** 🎉

