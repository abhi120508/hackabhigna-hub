# Certificate Generation System

## Overview
The HackAbhigna certificate generation system creates professional PDF certificates for hackathon participants. It supports multiple generation methods with automatic fallback.

## Quick Start (30 seconds)

```bash
# 1. Navigate to server directory
cd hackabhigna-hub/server

# 2. Create .env file
cp .env.example .env

# 3. Add this line to .env
FORCE_PDFKIT=true

# 4. Restart server
npm run dev

# 5. Test certificate generation
node check-certificate-setup.js
```

## Generation Methods

### 1. PDFKit (Recommended ⭐)
**Best for:** Most users, all platforms, no setup required

```env
FORCE_PDFKIT=true
```

**Pros:**
- ✅ No installation needed
- ✅ Works on Windows, Mac, Linux
- ✅ Fast generation
- ✅ Professional output
- ✅ Already installed

**Cons:**
- Limited to PDFKit capabilities

### 2. LaTeX (Advanced)
**Best for:** Advanced customization, professional typography

```env
PDFLATEX_PATH=/path/to/pdflatex
```

**Installation:**
- **Windows:** Install MiKTeX from https://miktex.org
- **macOS:** `brew install --cask mactex`
- **Linux:** `sudo apt-get install texlive-latex-base texlive-latex-extra`

**Pros:**
- ✅ Professional typography
- ✅ Advanced customization
- ✅ Better text rendering

**Cons:**
- ❌ Requires LaTeX installation
- ❌ Slower generation
- ❌ Platform-specific setup

### 3. PDF.co API (Cloud)
**Best for:** Production, serverless, no local dependencies

```env
PDF_CO_API_KEY=your_api_key
```

**Setup:**
1. Sign up at https://pdf.co
2. Get API key
3. Add to .env

**Pros:**
- ✅ No local installation
- ✅ Scalable
- ✅ Reliable

**Cons:**
- ❌ Requires API key
- ❌ Internet dependent
- ❌ May have costs

## File Structure

```
server/
├── certificateGenerator.js      # Main generation logic
├── templates/
│   └── certificate.tex          # LaTeX template
├── check-certificate-setup.js   # Diagnostic tool
├── .env.example                 # Environment template
└── .env                         # Your configuration (create this)

public/certificate/
├── background.png               # Certificate background
├── logo.png                     # Watermark logo
├── Swamiji1-modified.png       # Left header image
├── Swamiji2-modified.png       # Right header image
├── google gemini logo.png       # Collaboration logo
├── streamz.png                  # Collaboration logo
├── environ.jpg                  # Collaboration logo
└── ICT.png                      # Knowledge partner logo
```

## API Endpoints

### Issue Certificates
```
POST /teams/:id/issue-certificates
```

**Response:**
```json
{
  "message": "Certificate email sent successfully."
}
```

### Debug Mode
```
POST /teams/:id/issue-certificates?debug=1
```

Returns base64 PDFs without sending emails.

## Troubleshooting

### "pdflatex not found"
```bash
# Solution 1: Use PDFKit
echo "FORCE_PDFKIT=true" >> server/.env

# Solution 2: Install LaTeX
# Windows: Download MiKTeX
# macOS: brew install --cask mactex
# Linux: sudo apt-get install texlive-latex-base
```

### "Certificate assets missing"
```bash
# Ensure all images exist in public/certificate/
ls -la public/certificate/
```

### "Email not sending"
```bash
# Check SENDGRID_API_KEY
echo $SENDGRID_API_KEY

# Verify in .env file
cat server/.env | grep SENDGRID
```

### "PDF generation timeout"
```bash
# Increase timeout in certificateGenerator.js
# Line 34: const opts = { cwd: tmpDir, timeout: 60000 };
```

## Diagnostic Tool

Run the setup checker:
```bash
node server/check-certificate-setup.js
```

This will:
- ✅ Check environment variables
- ✅ Verify required files
- ✅ Check dependencies
- ✅ Detect LaTeX installation
- ✅ Provide recommendations

## Certificate Content

### Header
- Institute name: Adichunchanagiri Institute of Technology
- Department: Computer Science & Engineering
- Monk logos (left and right)

### Main Content
- "CERTIFICATE OF PARTICIPATION"
- Participant name
- Team name
- Event description

### Collaborations
- Google Gemini
- Streamz
- Environ
- ICT (Knowledge Partner)

### Signatures
- Dr. Pushpa Ravikumar (Professor & Head)
- Dr. C. T Jayadeva (Principal)
- Dr. C. K Subbaraya (Director)

## Customization

### Change Certificate Template
Edit `server/templates/certificate.tex`:
```latex
% Replace participant name
__PARTICIPANT__

% Replace team name
__TEAM__
```

### Change Certificate Images
Replace files in `public/certificate/`:
- `background.png` - Full page background
- `logo.png` - Watermark
- `Swamiji1-modified.png` - Left header
- `Swamiji2-modified.png` - Right header

### Change PDFKit Layout
Edit `server/certificateGenerator.js` function `generateWithPdfKit()`:
- Adjust font sizes (line 157-177)
- Change positions (line 200-300)
- Modify colors and styles

## Performance

### Generation Time
- **PDFKit:** ~100-200ms per certificate
- **LaTeX:** ~500-1000ms per certificate
- **PDF.co API:** ~1-2s per certificate (network dependent)

### Batch Processing
For multiple certificates:
```javascript
for (const participant of team.participants) {
  await generateCertificatePDF(participant.name, team.teamName);
}
```

## Security

- ✅ Certificates generated server-side
- ✅ No sensitive data in PDFs
- ✅ Sent via secure email
- ✅ Temporary files cleaned up

## Support

For issues:
1. Run `node check-certificate-setup.js`
2. Check server logs
3. Verify .env configuration
4. Ensure all certificate assets exist

## Environment Variables

```env
# Force PDFKit (recommended)
FORCE_PDFKIT=true

# Or specify LaTeX path
PDFLATEX_PATH=/path/to/pdflatex

# Or use PDF.co API
PDF_CO_API_KEY=your_key

# Email configuration
SENDGRID_API_KEY=your_key
```

## Next Steps

1. ✅ Set `FORCE_PDFKIT=true` in `.env`
2. ✅ Restart server
3. ✅ Test with `check-certificate-setup.js`
4. ✅ Issue certificates via admin panel

