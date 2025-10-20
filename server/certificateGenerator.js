const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");
const axios = require("axios");

let PDFDocument;
try {
  PDFDocument = require("pdfkit");
} catch (e) {
  PDFDocument = null;
}

function escapeLaTeX(s = "") {
  return String(s)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([%&#{}_$^~^<>])/g, "\\$1");
}

function copyPublicCertificateAssets(dst) {
  const pubCertDir = path.join(__dirname, "..", "public", "certificate");
  if (!fs.existsSync(pubCertDir)) return;
  for (const f of fs.readdirSync(pubCertDir)) {
    const src = path.join(pubCertDir, f);
    const dest = path.join(dst, f);
    try {
      fs.copyFileSync(src, dest);
    } catch (e) {
      // ignore (directories / unreadable files)
    }
  }
}

function runPdflatex(tmpDir, pdflatexBin = "pdflatex") {
  const opts = { cwd: tmpDir, timeout: 30000 };
  const run = () =>
    spawnSync(
      pdflatexBin,
      ["-interaction=nonstopmode", "-halt-on-error", "main.tex"],
      opts
    );

  let res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString().slice(0, 2000);
    const err = (res.stderr || "").toString().slice(0, 2000);
    throw new Error(
      "pdflatex failed (pass1)\nstdout:\n" + out + "\nstderr:\n" + err
    );
  }
  res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString().slice(0, 2000);
    const err = (res.stderr || "").toString().slice(0, 2000);
    throw new Error(
      "pdflatex failed (pass2)\nstdout:\n" + out + "\nstderr:\n" + err
    );
  }
}

function generateWithLaTeX(
  participantName,
  teamName,
  pdflatexBin = "pdflatex"
) {
  const templatePath = path.join(__dirname, "templates", "certificate.tex");
  if (!fs.existsSync(templatePath))
    throw new Error("LaTeX template not found: " + templatePath);
  const tpl = fs.readFileSync(templatePath, "utf8");
  const tex = tpl
    .replace(/__PARTICIPANT__/g, escapeLaTeX(participantName))
    .replace(/__TEAM__/g, escapeLaTeX(teamName));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cert-"));
  try {
    fs.writeFileSync(path.join(tmp, "main.tex"), tex, "utf8");
    copyPublicCertificateAssets(tmp);
    runPdflatex(tmp, pdflatexBin);
    const pdfPath = path.join(tmp, "main.pdf");
    if (!fs.existsSync(pdfPath))
      throw new Error("PDF not produced by pdflatex");
    return fs.readFileSync(pdfPath);
  } finally {
    try {
      fs.rmSync(tmp, { recursive: true, force: true });
    } catch (e) {}
  }
}

function generateWithPdfKit(participantName, teamName) {
  if (!PDFDocument) throw new Error("pdfkit not installed (npm i pdfkit)");
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 36,
    });
    const bufs = [];
    doc.on("data", (b) => bufs.push(b));
    doc.on("end", () => resolve(Buffer.concat(bufs)));
    doc.on("error", reject);

    const assets = path.join(__dirname, "..", "public", "certificate");
    // Draw background image if present
    try {
      const bg = path.join(assets, "background.png");
      if (fs.existsSync(bg)) {
        doc.image(bg, 0, 0, { width: doc.page.width, height: doc.page.height });
      }
    } catch (e) {}

    // Header logos (left, right)
    try {
      const left = path.join(assets, "Swamiji1-modified.png");
      const right = path.join(assets, "Swamiji2-modified.png");
      const logoH = 80;
      if (fs.existsSync(left)) doc.image(left, 40, 30, { height: logoH });
      if (fs.existsSync(right))
        doc.image(right, doc.page.width - 40 - logoH, 30, { height: logoH });
    } catch (e) {}

    // Watermark / center logo (faint)
    try {
      const logo = path.join(assets, "logo.png");
      if (fs.existsSync(logo)) {
        const w = doc.page.width * 0.45;
        const x = (doc.page.width - w) / 2;
        const y = doc.page.height * 0.28;
        doc.opacity(0.08);
        doc.image(logo, x, y, { width: w });
        doc.opacity(1);
      }
    } catch (e) {}

    // Title
    doc
      .fillColor("#0b663e")
      .fontSize(44)
      .font("Helvetica-Bold")
      .text("CERTIFICATE", { align: "center" });
    doc.moveDown(0.1);
    doc
      .fontSize(20)
      .font("Helvetica")
      .text("OF PARTICIPATION", { align: "center" });
    doc.moveDown(1.2);

    // Participant name
    doc
      .fillColor("black")
      .fontSize(30)
      .font("Helvetica-Bold")
      .text(participantName, { align: "center" });
    doc.moveDown(0.3);
    doc
      .fontSize(14)
      .font("Helvetica")
      .text(`Team: ${teamName}`, { align: "center" });
    doc.moveDown(0.6);
    doc
      .fontSize(16)
      .text(
        "This is to certify that the above participant has taken part in HACKABHIGNA.",
        { align: "center" }
      );

    // Sponsor logos row
    try {
      const logos = ["google gemini logo.png", "streamz.png", "environ.jpg"];
      const logoSize = 50;
      const totalWidth = logos.length * logoSize + (logos.length - 1) * 30;
      let startX = (doc.page.width - totalWidth) / 2;
      const y = doc.y + 20;
      for (const ln of logos) {
        const p = path.join(assets, ln);
        if (fs.existsSync(p)) {
          doc.image(p, startX, y, { height: logoSize });
        }
        startX += logoSize + 30;
      }
      doc.moveDown(4);
    } catch (e) {}

    // Signature block (three columns with multi-line labels)
    {
      const sigY2 = doc.page.height - 120;
      const colW2 = 180;
      const leftColX = 80;
      const centerColX = doc.page.width / 2 - colW2 / 2;
      const rightColX = doc.page.width - 80 - colW2;

      doc
        .moveTo(leftColX, sigY2)
        .lineTo(leftColX + colW2, sigY2)
        .stroke();
      doc.text(
        "Dr. Pushpa Ravikumar\nProfessor & Head, Dept. of CS&E\nAIT, Chikkamagaluru",
        leftColX,
        sigY2 + 6,
        { width: colW2, align: "center" }
      );

      doc
        .moveTo(centerColX, sigY2)
        .lineTo(centerColX + colW2, sigY2)
        .stroke();
      doc.text(
        "Dr. C. T Jayadeva\nPrincipal\nAIT, Chikkamagaluru",
        centerColX,
        sigY2 + 6,
        { width: colW2, align: "center" }
      );

      doc
        .moveTo(rightColX, sigY2)
        .lineTo(rightColX + colW2, sigY2)
        .stroke();
      doc.text(
        "Dr. C. K Subbaraya\nDirector, AIT\nRegister, ACU",
        rightColX,
        sigY2 + 6,
        { width: colW2, align: "center" }
      );
    }

    doc.end();
  });
}

/**
 * Generate PDF buffer: prefer pdflatex when available unless FORCE_PDFKIT env forces fallback.
 */
async function findPdflatex() {
  // allow override via env
  const envPath = process.env.PDFLATEX_PATH || process.env.PDFLATEX_BIN;
  const candidates = [];
  if (envPath) candidates.push(envPath);

  // Common Windows MiKTeX locations (add more paths)
  candidates.push(
    "C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/MiKTeX/miktex/bin/pdflatex.exe",
    "C:/Program Files/MiKTeX 2.9/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/texlive/2023/bin/win32/pdflatex.exe",
    "C:/texlive/2023/bin/win32/pdflatex.exe",
    "C:/Program Files (x86)/MiKTeX/miktex/bin/pdflatex.exe",
    "C:/Program Files (x86)/MiKTeX 2.9/miktex/bin/pdflatex.exe",
    "C:/MiKTeX/miktex/bin/x64/pdflatex.exe",
    "C:/MiKTeX/miktex/bin/pdflatex.exe"
  );

  // POSIX locations
  candidates.push(
    "/usr/bin/pdflatex",
    "/usr/local/bin/pdflatex",
    "/Library/TeX/texbin/pdflatex"
  );

  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) {
        console.log("certificateGenerator: found pdflatex at", p);
        return p;
      }
    } catch (e) {}
  }

  // last resort: try running plain pdflatex on PATH
  try {
    const check = spawnSync("pdflatex", ["--version"], { timeout: 3000 });
    if (check.status === 0) {
      console.log("certificateGenerator: found pdflatex on PATH");
      return "pdflatex";
    }
  } catch (e) {}

  console.log("certificateGenerator: pdflatex not found in any location");
  return null;
}

/**
 * Generate PDF buffer: prefer online LaTeX API, then local pdflatex, then HTML API, then pdfkit.
 * Returns an object { buffer: Buffer, method: 'latex'|'api'|'pdfkit', pdflatexPath?: string }
 */
async function generateCertificatePDF(participantName, teamName) {
  const forcePdfKit =
    process.env.FORCE_PDFKIT === "1" || process.env.FORCE_PDFKIT === "true";
  const forceLatex =
    process.env.FORCE_LATEX === "1" || process.env.FORCE_LATEX === "true";

  // Try online LaTeX API first (prioritize online LaTeX)
  if (!forcePdfKit) {
    try {
      const apiUrl =
        process.env.CERTIFICATE_API_URL ||
        "https://api.pdf.co/v1/pdf/generate/latex";
      const apiKey = process.env.PDF_CO_API_KEY;

      if (apiKey) {
        // Read LaTeX template and replace placeholders
        const templatePath = path.join(
          __dirname,
          "templates",
          "certificate.tex"
        );
        if (!fs.existsSync(templatePath))
          throw new Error("LaTeX template not found: " + templatePath);
        const tpl = fs.readFileSync(templatePath, "utf8");
        const latexContent = tpl
          .replace(/__PARTICIPANT__/g, escapeLaTeX(participantName))
          .replace(/__TEAM__/g, escapeLaTeX(teamName));

        const response = await axios.post(
          apiUrl,
          {
            latex: latexContent,
            name: "certificate.pdf",
          },
          {
            headers: {
              "x-api-key": apiKey,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          }
        );

        if (response.data) {
          console.log("certificateGenerator: used online LaTeX API");
          return { buffer: Buffer.from(response.data), method: "latex" };
        }
      }
    } catch (e) {
      console.error(
        "certificateGenerator: online LaTeX API failed:",
        e.message
      );
      if (forceLatex) {
        throw e; // If forcing LaTeX, don't fallback
      }
      // fallthrough to local pdflatex
    }
  }

  // Check for local pdflatex second
  const pdflatexPath = await findPdflatex();
  if (pdflatexPath && !forcePdfKit) {
    try {
      const buf = generateWithLaTeX(participantName, teamName, pdflatexPath);
      console.log("certificateGenerator: used local pdflatex at", pdflatexPath);
      return { buffer: buf, method: "latex", pdflatexPath };
    } catch (e) {
      console.error(
        "certificateGenerator: local pdflatex generation failed:",
        e && (e.message || e)
      );
      if (forceLatex) {
        throw e; // If forcing LaTeX, don't fallback
      }
      // fallthrough to HTML API or pdfkit
    }
  } else if (!pdflatexPath && !forcePdfKit) {
    console.log(
      "certificateGenerator: local pdflatex not found, trying HTML API fallback"
    );
  }

  // Try HTML API method as third option
  if (!forceLatex) {
    try {
      const apiUrl =
        process.env.CERTIFICATE_API_URL_HTML ||
        "https://api.pdf.co/v1/pdf/generate/html";
      const apiKey = process.env.PDF_CO_API_KEY;

      if (apiKey) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Certificate</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .certificate {
                width: 800px;
                height: 600px;
                margin: 50px auto;
                background: white;
                border: 10px solid #0b663e;
                position: relative;
                padding: 40px;
                box-sizing: border-box;
              }
              .header {
                text-align: center;
                color: #0b663e;
                margin-bottom: 30px;
              }
              .title {
                font-size: 48px;
                font-weight: bold;
                margin: 0;
              }
              .subtitle {
                font-size: 24px;
                margin: 10px 0;
              }
              .content {
                text-align: center;
                margin: 40px 0;
              }
              .participant-name {
                font-size: 36px;
                font-weight: bold;
                margin: 20px 0;
              }
              .team-name {
                font-size: 18px;
                margin: 10px 0;
              }
              .description {
                font-size: 20px;
                margin: 20px 0;
                line-height: 1.5;
              }
              .signatures {
                position: absolute;
                bottom: 80px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-around;
              }
              .signature {
                text-align: center;
                width: 200px;
              }
              .signature-line {
                border-top: 1px solid black;
                margin: 40px 0 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="header">
                <h1 class="title">CERTIFICATE</h1>
                <h2 class="subtitle">OF PARTICIPATION</h2>
              </div>
              <div class="content">
                <p>This is to certify that</p>
                <h3 class="participant-name">${participantName}</h3>
                <p class="team-name">Team: ${teamName}</p>
                <p class="description">has taken part in HACKABHIGNA.</p>
              </div>
              <div class="signatures">
                <div class="signature">
                  <div class="signature-line"></div>
                  <p>Dr. Pushpa Ravikumar<br>Professor & Head, Dept. of CS&E<br>AIT, Chikkamagaluru</p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p>Dr. C. T Jayadeva<br>Principal<br>AIT, Chikkamagaluru</p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p>Dr. C. K Subbaraya<br>Director, AIT<br>Register, ACU</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        const response = await axios.post(
          apiUrl,
          {
            html: htmlContent,
            name: "certificate.pdf",
            margins: "40px",
          },
          {
            headers: {
              "x-api-key": apiKey,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer",
          }
        );

        if (response.data) {
          console.log("certificateGenerator: used HTML API method");
          return { buffer: Buffer.from(response.data), method: "api" };
        }
      }
    } catch (e) {
      console.error("certificateGenerator: HTML API method failed:", e.message);
      // fallthrough to pdfkit
    }
  }

  // Final fallback to pdfkit
  const buf = await generateWithPdfKit(participantName, teamName);
  return { buffer: buf, method: "pdfkit" };
}

module.exports = { generateCertificatePDF, findPdflatex };
