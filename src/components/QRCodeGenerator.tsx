import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 128,
}) => {
  // Generate QR code URL format that matches the scanning logic
  const qrValue = value.startsWith('https://') ? value : `https://hackabhigna.com/qr/${value}`;
  
  return (
    <div className="qr-code-container flex flex-col items-center space-y-2">
      <QRCodeCanvas 
        value={qrValue} 
        size={size}
        level="M"
        includeMargin={true}
      />
      <p className="text-xs text-muted-foreground text-center">
        Scan to verify team: {value}
      </p>
    </div>
  );
};

export default QRCodeGenerator;
