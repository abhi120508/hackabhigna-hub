# Deploy Frontend to GitHub Pages with Environment Variables

## The Problem

The frontend is deployed to **GitHub Pages** (not Render). Environment variables need to be available **during the build process**, not at runtime.

When you run `npm run build`, Vite bundles the environment variables into the JavaScript code. If the variables aren't set during build, they won't be available in the frontend.

## Solution: Build and Deploy Locally

### Step 1: Set Environment Variables on Your Machine

**Windows (PowerShell):**
```powershell
$env:VITE_GITHUB_OWNER = "hackabhigna2025-hub"
$env:VITE_GITHUB_TOKEN = "ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5"
```

**Windows (Command Prompt):**
```cmd
set VITE_GITHUB_OWNER=hackabhigna2025-hub
set VITE_GITHUB_TOKEN=ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
```

**Mac/Linux:**
```bash
export VITE_GITHUB_OWNER=hackabhigna2025-hub
export VITE_GITHUB_TOKEN=ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
```

### Step 2: Build the Frontend

```bash
cd d:\Desktop\safe3\hackabhigna-hub
npm run build
```

This will:
- Read the environment variables you just set
- Bundle them into the JavaScript code
- Create the `dist/` folder with the production build

### Step 3: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
- Push the `dist/` folder to the `gh-pages` branch
- Deploy to GitHub Pages
- Your site will be live in a few seconds

### Step 4: Verify

1. Open your GitHub Pages URL in browser
2. Press F12 → Console
3. Look for: `✓ GitHub token configured: ghp_8aFXxU...`
4. Select a team and click Refresh
5. Commits should appear

## Complete Command Sequence (Windows PowerShell)

```powershell
# Set environment variables
$env:VITE_GITHUB_OWNER = "hackabhigna2025-hub"
$env:VITE_GITHUB_TOKEN = "ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5"

# Navigate to project
cd d:\Desktop\safe3\hackabhigna-hub

# Build
npm run build

# Deploy
npm run deploy
```

## Complete Command Sequence (Windows Command Prompt)

```cmd
set VITE_GITHUB_OWNER=hackabhigna2025-hub
set VITE_GITHUB_TOKEN=ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5
cd d:\Desktop\safe3\hackabhigna-hub
npm run build
npm run deploy
```

## What Happens Behind the Scenes

1. **npm run build**
   - Reads `VITE_GITHUB_OWNER` and `VITE_GITHUB_TOKEN` from environment
   - Embeds them into the JavaScript bundle
   - Creates `dist/` folder

2. **npm run deploy**
   - Runs `npm run build` first (predeploy script)
   - Pushes `dist/` to `gh-pages` branch on GitHub
   - GitHub Pages serves the new build

3. **Browser loads the app**
   - Gets the JavaScript with embedded environment variables
   - `import.meta.env.VITE_GITHUB_TOKEN` now has the value
   - GitHub API calls work!

## Troubleshooting

### Still seeing "GitHub token NOT configured"?

1. **Check environment variables were set:**
   ```powershell
   $env:VITE_GITHUB_OWNER
   $env:VITE_GITHUB_TOKEN
   ```
   Should print the values

2. **Check build output:**
   ```bash
   npm run build
   ```
   Should complete without errors

3. **Check deployment:**
   ```bash
   npm run deploy
   ```
   Should show success message

4. **Hard refresh browser:**
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito window

### Getting "dist folder not found"?

Make sure you ran `npm run build` first:
```bash
npm run build
npm run deploy
```

### Getting git errors?

Make sure you have git configured:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Important Notes

⚠️ **Security:**
- The token will be visible in the browser (it's in the JavaScript)
- This is OK for a hackathon project
- For production, use a backend API to fetch GitHub data instead

✅ **Verification:**
- After deployment, check browser console
- Should see: `✓ GitHub token configured`
- Should see: `Fetched X commits for owner/repo`

## Next Steps

1. Set environment variables on your machine
2. Run `npm run build`
3. Run `npm run deploy`
4. Wait 30 seconds for GitHub Pages to update
5. Hard refresh your browser
6. Check console for success messages
7. Test by selecting a team and clicking Refresh

