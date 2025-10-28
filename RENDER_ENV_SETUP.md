# Render Environment Variables Setup - Step by Step

## The Issue
The environment variables are defined in `render.yaml` but the **actual values** are not set in the Render dashboard. You need to manually add them.

## Step-by-Step Instructions

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Log in with your account
3. Find your service (hackabhigna-backend or similar)

### Step 2: Access Environment Variables
1. Click on your service
2. Go to **Settings** tab
3. Scroll down to **Environment** section
4. You should see existing variables like:
   - ATLAS_URI
   - SENDGRID_API_KEY
   - CLOUDINARY_CLOUD_NAME
   - etc.

### Step 3: Add GitHub Variables

You need to add **4 new environment variables**. For each one:

1. Click **"Add Environment Variable"** button
2. Enter the key and value
3. Click **Save**

#### Variable 1:
- **Key:** `VITE_GITHUB_OWNER`
- **Value:** `hackabhigna2025-hub`

#### Variable 2:
- **Key:** `VITE_GITHUB_TOKEN`
- **Value:** `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5`

#### Variable 3:
- **Key:** `GITHUB_OWNER`
- **Value:** `hackabhigna2025-hub`

#### Variable 4:
- **Key:** `GITHUB_TOKEN`
- **Value:** `ghp_8aFXxU8itsTogDqOBuWnU2fZvP3W02nUpW5`

### Step 4: Trigger Redeploy

After adding all 4 variables:

1. Go to **Deployments** tab
2. Click **"Manual Deploy"** button
3. Wait for the build to complete (usually 2-5 minutes)
4. Check the build logs for any errors

### Step 5: Verify

1. Once deployed, open your application
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. You should see:
   ```
   ✓ GitHub token configured: ghp_8aFXxU...
   ✓ GitHub owner configured: hackabhigna2025-hub
   ```

5. If you still see the error, try:
   - Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
   - Clear browser cache
   - Open in incognito/private window

## Important Notes

⚠️ **Security Warning:**
- Never commit the GitHub token to version control
- The token is visible in the Render dashboard (only to you)
- If the token is compromised, regenerate it on GitHub

## Troubleshooting

### Still seeing "GitHub token NOT configured"?
- [ ] Check that you added all 4 variables
- [ ] Verify the values are exactly correct (copy-paste to avoid typos)
- [ ] Wait 5 minutes after deployment
- [ ] Hard refresh the browser (Ctrl+Shift+R)
- [ ] Check that the deployment completed successfully

### Getting "GitHub API error: 401"?
- The token is invalid or expired
- Generate a new token on GitHub with `repo` scope

### Getting "GitHub API error: 404"?
- The repository doesn't exist
- Check that `VITE_GITHUB_OWNER` is correct

## What These Variables Do

- **VITE_GITHUB_OWNER**: The GitHub organization/user that owns the repositories
- **VITE_GITHUB_TOKEN**: Personal access token for GitHub API authentication (frontend)
- **GITHUB_OWNER**: Same as above (for backend if needed)
- **GITHUB_TOKEN**: Same as above (for backend if needed)

The `VITE_` prefix is required for Vite to expose these to the frontend JavaScript code.

