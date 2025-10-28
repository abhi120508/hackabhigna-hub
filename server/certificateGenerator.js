const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

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
  if (!fs.existsSync(pubCertDir)) {
    console.warn(`⚠️  Certificate assets directory not found: ${pubCertDir}`);
    return;
  }

  const files = fs.readdirSync(pubCertDir);
  console.log(`   📦 Found ${files.length} asset files to copy`);

  for (const f of files) {
    const src = path.join(pubCertDir, f);
    const dest = path.join(dst, f);
    try {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        // Recursively copy directory
        fs.mkdirSync(dest, { recursive: true });
        const subFiles = fs.readdirSync(src);
        for (const subFile of subFiles) {
          fs.copyFileSync(path.join(src, subFile), path.join(dest, subFile));
        }
        console.log(`      ✓ Copied: ${f}/ (${subFiles.length} files)`);
      } else {
        // Copy file
        fs.copyFileSync(src, dest);
        console.log(`      ✓ Copied: ${f}`);
      }
    } catch (e) {
      console.warn(`      ⚠️  Failed to copy ${f}: ${e.message}`);
    }
  }
}

function runPdflatex(tmpDir, pdflatexBin = "pdflatex") {
  const opts = { cwd: tmpDir, timeout: 30000, encoding: "utf8" };
  const run = () =>
    spawnSync(pdflatexBin, ["-interaction=batchmode", "main.tex"], opts);

  let res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString();
    const err = (res.stderr || "").toString();

    // Try to read the log file for more details
    let logContent = "";
    try {
      const logPath = path.join(tmpDir, "main.log");
      if (fs.existsSync(logPath)) {
        logContent = fs.readFileSync(logPath, "utf8");
      }
    } catch (e) {
      // ignore
    }

    const fullError = `pdflatex failed (pass1)\nstdout:\n${out.slice(
      0,
      3000
    )}\nstderr:\n${err.slice(0, 3000)}\nlog:\n${logContent.slice(-2000)}`;
    console.error("Full pdflatex error:", fullError);
    throw new Error(fullError);
  }
  res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString();
    const err = (res.stderr || "").toString();

    let logContent = "";
    try {
      const logPath = path.join(tmpDir, "main.log");
      if (fs.existsSync(logPath)) {
        logContent = fs.readFileSync(logPath, "utf8");
      }
    } catch (e) {
      // ignore
    }

    const fullError = `pdflatex failed (pass2)\nstdout:\n${out.slice(
      0,
      3000
    )}\nstderr:\n${err.slice(0, 3000)}\nlog:\n${logContent.slice(-2000)}`;
    console.error("Full pdflatex error:", fullError);
    throw new Error(fullError);
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
    .replace(/PARTICIPANT_NAME/g, escapeLaTeX(participantName))
    .replace(/TEAM_DOMAIN/g, escapeLaTeX(teamName || ""));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cert-"));
  console.log(`   📁 LaTeX temp directory: ${tmp}`);
  try {
    fs.writeFileSync(path.join(tmp, "main.tex"), tex, "utf8");
    console.log(`   ✅ LaTeX template written`);

    copyPublicCertificateAssets(tmp);
    const copiedFiles = fs.readdirSync(tmp);
    console.log(`   ✅ Assets copied: ${copiedFiles.join(", ")}`);

    runPdflatex(tmp, pdflatexBin);
    console.log(`   ✅ pdflatex compilation successful`);

    const pdfPath = path.join(tmp, "main.pdf");
    if (!fs.existsSync(pdfPath))
      throw new Error("PDF not produced by pdflatex");

    const pdfBuffer = fs.readFileSync(pdfPath);
    console.log(`   ✅ PDF read: ${pdfBuffer.length} bytes`);
    return pdfBuffer;
  } finally {
    try {
      fs.rmSync(tmp, { recursive: true, force: true });
    } catch (e) {
      // ignore cleanup errors
    }
  }
}

async function generateWithPdfKit(participantName, teamName) {
  if (!PDFDocument) throw new Error("pdfkit not available");

  const doc = new PDFDocument({
    size: [1122, 794], // landscape letter size in points
    margin: 50,
  });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Add background if available
  const backgroundPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "background.png"
  );
  if (fs.existsSync(backgroundPath)) {
    doc.image(backgroundPath, 0, 0, { width: 1122, height: 794 });
  }

  // Watermark logo
  const logoPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "logo.png"
  );
  if (fs.existsSync(logoPath)) {
    doc.opacity(0.08);
    doc.image(logoPath, 1122 / 2 - 300, 794 / 2 - 200, {
      width: 600,
      height: 400,
      align: "center",
    });
    doc.opacity(1);
  }

  // Header monks and institute text
  const monkLeftPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "Swamiji1-modified.png"
  );
  if (fs.existsSync(monkLeftPath)) {
    doc.image(monkLeftPath, 50, 30, { height: 100 });
  }

  const monkRightPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "Swamiji2-modified.png"
  );
  if (fs.existsSync(monkRightPath)) {
    doc.image(monkRightPath, 1122 - 150, 30, { height: 100 });
  }

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("|| JAI SRI GURUDEV ||", 0, 40, { align: "center" });
  doc
    .fontSize(16)
    .text("ADICHUNCHANAGIRI INSTITUTE OF TECHNOLOGY", { align: "center" });
  doc
    .fontSize(11)
    .text("JYOTHI NAGARA, CHIKKAMAGALURU-577102, KARNATAKA, INDIA", {
      align: "center",
    });
  doc.fontSize(13).text("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", {
    align: "center",
  });

  // Certificate content
  doc
    .fontSize(48)
    .font("Helvetica-Bold")
    .text("CERTIFICATE", 0, 200, { align: "center" });
  doc.fontSize(20).text("OF PARTICIPATION", { align: "center" });
  doc.fontSize(20).text("This is to certify that", { align: "center" });
  doc
    .fontSize(28)
    .font("Helvetica-Bold")
    .text(participantName, { align: "center" });
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(`Team: ${teamName}`, { align: "center" });
  doc
    .fontSize(14)
    .text(
      "This is to certify that the above participant has taken part in HACKABHIGNA (domain name), a 24-Hours National-Level Hackathon organized by the Department of Computer Science & Engineering, Adichunchanagiri Institute of Technology.",
      100,
      400,
      { width: 922, align: "center" }
    );

  // Collaboration logos
  const geminiPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "google gemini logo.png"
  );
  const streamzPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "streamz.png"
  );
  const environPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "environ.jpg"
  );

  let logoY = 550;
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("In Collaboration with", 0, logoY, {
      align: "center",
    });
  logoY += 20;

  let logoX = 1122 / 2 - 150;
  if (fs.existsSync(geminiPath)) {
    doc.image(geminiPath, logoX, logoY, { height: 30 });
    logoX += 100;
  }
  if (fs.existsSync(streamzPath)) {
    doc.image(streamzPath, logoX, logoY, { height: 30 });
    logoX += 100;
  }
  if (fs.existsSync(environPath)) {
    doc.image(environPath, logoX, logoY, { height: 30 });
  }

  // Knowledge partner
  const ictPath = path.join(
    __dirname,
    "..",
    "public",
    "certificate",
    "ICT.png"
  );
  if (fs.existsSync(ictPath)) {
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Knowledge Partner", 1122 - 200, logoY - 20, { width: 150 });
    doc.image(ictPath, 1122 - 150, logoY + 10, { height: 40 });
  }

  // Signatures
  const signatureY = 650;
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Dr. Pushpa Ravikumar", 100, signatureY, {
      width: 200,
      align: "center",
    });
  doc.fontSize(10).text("Professor & Head, Dept. of CS&E", { align: "center" });
  doc.text("AIT, Chikkamagaluru", { align: "center" });

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Dr. C. T Jayadeva", 1122 / 2 - 100, signatureY, {
      width: 200,
      align: "center",
    });
  doc.fontSize(10).text("Principal", { align: "center" });
  doc.text("AIT, Chikkamagaluru", { align: "center" });

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Dr. C. K Subbaraya", 1122 - 300, signatureY, {
      width: 200,
      align: "center",
    });
  doc.fontSize(10).text("Director, AIT", { align: "center" });
  doc.text("Register, ACU", { align: "center" });

  // Add signature lines
  doc
    .moveTo(150, signatureY - 10)
    .lineTo(250, signatureY - 10)
    .stroke();
  doc
    .moveTo(1122 / 2 - 50, signatureY - 10)
    .lineTo(1122 / 2 + 50, signatureY - 10)
    .stroke();
  doc
    .moveTo(1122 - 250, signatureY - 10)
    .lineTo(1122 - 150, signatureY - 10)
    .stroke();

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on("error", reject);
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

  // Common Windows MiKTeX locations
  candidates.push(
    "C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/MiKTeX/miktex/bin/pdflatex.exe",
    "C:/Program Files/MiKTeX 2.9/miktex/bin/x64/pdflatex.exe",
    "C:/texlive/2023/bin/win32/pdflatex.exe",
    "C:/texlive/2023/bin/win32/pdflatex.exe"
  );

  // POSIX locations
  candidates.push(
    "/usr/bin/pdflatex",
    "/usr/local/bin/pdflatex",
    "/Library/TeX/texbin/pdflatex"
  );

  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p;
    } catch (e) {}
  }

  // last resort: try running plain pdflatex on PATH
  try {
    const check = spawnSync("pdflatex", ["--version"], { timeout: 3000 });
    if (check.status === 0) return "pdflatex";
  } catch (e) {}
  return null;
}

/**
 * Generate PDF buffer: prefer pdflatex when available unless FORCE_PDFKIT env forces fallback.
 * Returns an object { buffer: Buffer, method: 'latex'|'pdfkit', pdflatexPath?: string }
 */
async function generateCertificatePDF(participantName, teamName) {
  const forcePdfKit =
    process.env.FORCE_PDFKIT === "1" || process.env.FORCE_PDFKIT === "true";

  // If FORCE_PDFKIT is set, skip LaTeX entirely
  if (forcePdfKit) {
    console.log("certificateGenerator: FORCE_PDFKIT is enabled, using pdfkit");
    const buf = await generateWithPdfKit(participantName, teamName);
    return { buffer: buf, method: "pdfkit" };
  }

  // Try to find and use pdflatex
  const pdflatexPath = await findPdflatex();
  if (pdflatexPath) {
    try {
      console.log(
        "certificateGenerator: attempting LaTeX generation with",
        pdflatexPath
      );
      const buf = generateWithLaTeX(participantName, teamName, pdflatexPath);
      console.log(
        "✅ certificateGenerator: successfully used pdflatex at",
        pdflatexPath
      );
      return { buffer: buf, method: "latex", pdflatexPath };
    } catch (e) {
      console.error(
        "❌ certificateGenerator: pdflatex generation failed:",
        e && (e.message || e)
      );
      console.log("certificateGenerator: falling back to pdfkit");
      // fallthrough to pdfkit
    }
  } else {
    console.log(
      "⚠️  certificateGenerator: pdflatex not found on system, using pdfkit fallback"
    );
  }

  // Fallback to pdfkit
  try {
    const buf = await generateWithPdfKit(participantName, teamName);
    return { buffer: buf, method: "pdfkit" };
  } catch (pdfkitErr) {
    console.error(
      "❌ certificateGenerator: pdfkit generation also failed:",
      pdfkitErr && (pdfkitErr.message || pdfkitErr)
    );
    throw pdfkitErr;
  }
}

module.exports = { generateCertificatePDF, findPdflatex };
