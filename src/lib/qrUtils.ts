// QR Code utilities and mock functions

export interface QRCodeData {
  uniqueId: string;
  teamName: string;
  domain: string;
  githubRepo: string;
}

// Mock QR code scanning result
export function parseQRCode(qrData: string): { uniqueId: string } | null {
  try {
    const data = qrData.trim();

    // Extract unique ID from QR URL format: https://hackabhigna.com/qr/UNIQUEID
    const urlMatch = data.match(/\/qr\/([A-Za-z0-9]+)$/i);
    if (urlMatch && urlMatch[1]) {
      return { uniqueId: urlMatch[1].toUpperCase() };
    }

    // If direct unique ID is provided (case-insensitive)
    if (/^[A-Za-z]{4}\d{3}$/i.test(data)) {
      return { uniqueId: data.toUpperCase() };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Generate QR code image URL (mock)
export function generateQRCodeImage(data: string): string {
  // In a real implementation, you'd use a QR code library
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="12">${data}</text></svg>`;
}

// Mock QR scanner
export class MockQRScanner {
  static async startScan(): Promise<{ success: boolean; data?: string; error?: string }> {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock scan results - randomly return one of the registered team IDs
    const mockQRCodes = [
      'https://hackabhigna.com/qr/WETE001',
      'https://hackabhigna.com/qr/MOAP003',
      'AICO002', // Direct unique ID format
    ];
    
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    
    return {
      success: true,
      data: randomCode,
    };
  }

  static stopScan(): void {
    console.log('QR Scanner stopped');
  }
}

// Mock email template for QR code
export function generateQREmailTemplate(teamData: any): string {
  return `
    <html>
      <body>
        <h2>Congratulations ${teamData.teamName}!</h2>
        <p>Your team has been approved for HackAbhigna 2024.</p>
        
        <h3>Team Details:</h3>
        <ul>
          <li><strong>Team ID:</strong> ${teamData.uniqueId}</li>
          <li><strong>Domain:</strong> ${teamData.domain}</li>
          <li><strong>GitHub Repository:</strong> <a href="${teamData.githubRepo}">${teamData.githubRepo}</a></li>
        </ul>
        
        <h3>Your QR Code:</h3>
        <p>Please save this QR code for event check-in:</p>
        <img src="${generateQRCodeImage(teamData.qrCode)}" alt="Team QR Code" />
        
        <p>QR Code Data: ${teamData.qrCode}</p>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Your dedicated GitHub repository has been created: <a href="${teamData.githubRepo}">${teamData.githubRepo}</a></li>
          <li>Use the QR code above for event check-in</li>
          <li>Bring this email or save the QR code to your device</li>
        </ol>
        
        <p>Good luck with your project!</p>
        <p>Best regards,<br>HackAbhigna Team</p>
      </body>
    </html>
  `;
}