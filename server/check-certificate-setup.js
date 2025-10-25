#!/usr/bin/env node

/**
 * Certificate Setup Checker
 * Run this script to diagnose certificate generation issues
 * 
 * Usage: node check-certificate-setup.js
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
require("dotenv").config();

console.log("\n" + "=".repeat(60));
console.log("🔍 HackAbhigna Certificate Generation Setup Checker");
console.log("=".repeat(60) + "\n");

// Check 1: Environment Variables
console.log("📋 Environment Variables:");
console.log("─".repeat(60));
const forcePdfKit = process.env.FORCE_PDFKIT;
const pdflatexPath = process.env.PDFLATEX_PATH;
const pdfCoKey = process.env.PDF_CO_API_KEY;

console.log(`  FORCE_PDFKIT: ${forcePdfKit ? "✅ " + forcePdfKit : "❌ Not set"}`);
console.log(`  PDFLATEX_PATH: ${pdflatexPath ? "✅ " + pdflatexPath : "❌ Not set"}`);
console.log(`  PDF_CO_API_KEY: ${pdfCoKey ? "✅ Set" : "❌ Not set"}`);

// Check 2: Required Files
console.log("\n📁 Required Files:");
console.log("─".repeat(60));

const requiredFiles = [
  "server/templates/certificate.tex",
  "public/certificate/background.png",
  "public/certificate/logo.png",
  "public/certificate/Swamiji1-modified.png",
  "public/certificate/Swamiji2-modified.png",
  "public/certificate/google gemini logo.png",
  "public/certificate/streamz.png",
  "public/certificate/environ.jpg",
  "public/certificate/ICT.png",
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, "..", file);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? "✅" : "❌"} ${file}`);
  if (!exists) allFilesExist = false;
}

// Check 3: Dependencies
console.log("\n📦 Dependencies:");
console.log("─".repeat(60));

const dependencies = ["pdfkit", "pdfmake", "puppeteer", "qrcode"];
for (const dep of dependencies) {
  try {
    require.resolve(dep);
    console.log(`  ✅ ${dep}`);
  } catch (e) {
    console.log(`  ❌ ${dep} - NOT INSTALLED`);
  }
}

// Check 4: pdflatex Detection
console.log("\n🔧 LaTeX Detection:");
console.log("─".repeat(60));

const candidates = [
  "C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
  "C:/Program Files/MiKTeX/miktex/bin/pdflatex.exe",
  "C:/texlive/2023/bin/win32/pdflatex.exe",
  "/usr/bin/pdflatex",
  "/usr/local/bin/pdflatex",
  "/Library/TeX/texbin/pdflatex",
];

let pdflatexFound = false;
for (const candidate of candidates) {
  if (fs.existsSync(candidate)) {
    console.log(`  ✅ Found: ${candidate}`);
    pdflatexFound = true;
  }
}

if (!pdflatexFound) {
  try {
    const check = spawnSync("pdflatex", ["--version"], { timeout: 3000 });
    if (check.status === 0) {
      console.log(`  ✅ pdflatex found in PATH`);
      pdflatexFound = true;
    }
  } catch (e) {
    // pdflatex not in PATH
  }
}

if (!pdflatexFound) {
  console.log(`  ❌ pdflatex not found on system`);
}

// Check 5: Recommendations
console.log("\n💡 Recommendations:");
console.log("─".repeat(60));

if (forcePdfKit === "true") {
  console.log("  ✅ FORCE_PDFKIT is enabled - using PDFKit");
  console.log("     Certificates will generate without LaTeX");
} else if (pdflatexFound) {
  console.log("  ✅ pdflatex is installed - LaTeX certificates available");
  console.log("     Set PDFLATEX_PATH in .env for explicit path");
} else if (pdfCoKey) {
  console.log("  ✅ PDF.co API key is set - cloud generation available");
} else {
  console.log("  ⚠️  No certificate generation method configured!");
  console.log("     RECOMMENDED: Set FORCE_PDFKIT=true in .env");
  console.log("     This uses PDFKit (already installed) - no setup needed");
}

// Check 6: Summary
console.log("\n📊 Summary:");
console.log("─".repeat(60));

let status = "✅ READY";
let issues = [];

if (!allFilesExist) {
  status = "⚠️  WARNING";
  issues.push("Some certificate assets are missing");
}

if (!forcePdfKit && !pdflatexFound && !pdfCoKey) {
  status = "❌ NOT READY";
  issues.push("No certificate generation method configured");
}

console.log(`  Status: ${status}`);
if (issues.length > 0) {
  console.log("  Issues:");
  for (const issue of issues) {
    console.log(`    - ${issue}`);
  }
}

// Quick Fix
console.log("\n🚀 Quick Fix:");
console.log("─".repeat(60));
console.log("  1. Open server/.env");
console.log("  2. Add this line: FORCE_PDFKIT=true");
console.log("  3. Restart your server");
console.log("  4. Certificates will now generate using PDFKit");

console.log("\n" + "=".repeat(60) + "\n");

