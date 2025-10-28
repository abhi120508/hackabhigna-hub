# Fix Repository Activation - Quick Steps

## The Issue
After scanning QR code and clicking "Activate Repository", you get "Activation Failed - Something went wrong"

## Root Cause
The GitHub token or owner is not properly configured in the Render environment variables.

## Fix (5 Minutes)

### Step 1: Go to Render Dashboard
- Open https://dashboard.render.com
- Log in with your account
- Find your service (hackabhigna-backend or similar)

### Step 2: Check Environment Variables
1. Click on your service
2. Go to **Settings** tab
3. Scroll to **Environment** section
4. Look for these variables:
   - `GITHUB_TOKEN` - Should start with `ghp_`
   - `GITHUB_OWNER` - Should be `hackabhigna2025-hub`

### Step 3: If Missing or Wrong

#### If `GITHUB_TOKEN` is missing or invalid:
1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: `HackAbhigna Activation`
4. Select scopes: Check **repo** (Full control of private repositories)
5. Click **Generate token**
6. Copy the token (you won't see it again!)
7. Go back to Render Dashboard
8. Click **Edit** next to `GITHUB_TOKEN`
9. Paste the new token
10. Click **Save**

#### If `GITHUB_OWNER` is missing:
1. Click **Add Environment Variable**
2. Key: `GITHUB_OWNER`
3. Value: `hackabhigna2025-hub`
4. Click **Save**

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Manual Deploy** button
3. Wait for build to complete (2-5 minutes)
4. Check logs for any errors

### Step 5: Test
1. Go back to QR Panel
2. Scan a team QR code
3. Click "Activate Repository"
4. Should now work! ✅

## If Still Not Working

### Check Browser Console
1. Press **F12** in QR Panel
2. Go to **Console** tab
3. Try activation again
4. Look for error message
5. Compare with [ACTIVATION_TROUBLESHOOTING.md](./ACTIVATION_TROUBLESHOOTING.md)

### Check Server Logs
1. Render Dashboard → Logs tab
2. Look for error messages
3. Search for "❌" or "Error"

### Verify Repository Exists
- Check: `https://github.com/hackabhigna2025-hub/TEAMCODE`
- Replace TEAMCODE with actual team code
- If doesn't exist, create it manually

## Environment Variables Needed

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_OWNER=hackabhigna2025-hub
ATLAS_URI=mongodb+srv://...
SENDGRID_API_KEY=SG.xxxxx...
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

## Need Help?

See detailed troubleshooting: [ACTIVATION_TROUBLESHOOTING.md](./ACTIVATION_TROUBLESHOOTING.md)

