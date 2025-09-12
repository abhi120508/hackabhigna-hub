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
  return (
    <div className="qr-code-container">
      <QRCodeCanvas value={value} size={size} />
    </div>
  );
};

export default QRCodeGenerator;
