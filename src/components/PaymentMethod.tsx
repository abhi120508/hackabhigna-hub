import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function PaymentMethod() {
  const accountDetails = {
    accountNumber: "64185686568",
    ifscCode: "SBIN0016280",
    accountHolderName: "THE PRINCIPAL A I T CHIKKAMAGALURU",
    registrationFee: "₹1,000"
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <CreditCard className="w-6 h-6" style={{ color: "#60a5fa" }} />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Fee */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2" style={{ color: "#60a5fa" }}>
            Registration Fee: {accountDetails.registrationFee}
          </h3>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-center">Bank Account Details</h4>
          
          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Account Holder Name</Label>
            <div className="flex gap-2">
              <Input
                id="accountHolder"
                value={accountDetails.accountHolderName}
                readOnly
                className="bg-muted/50"
              />
              <Button
                onClick={() => copyToClipboard(accountDetails.accountHolderName, "Account Holder Name")}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <div className="flex gap-2">
              <Input
                id="accountNumber"
                value={accountDetails.accountNumber}
                readOnly
                className="bg-muted/50"
              />
              <Button
                onClick={() => copyToClipboard(accountDetails.accountNumber, "Account Number")}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <div className="flex gap-2">
              <Input
                id="ifscCode"
                value={accountDetails.ifscCode}
                readOnly
                className="bg-muted/50"
              />
              <Button
                onClick={() => copyToClipboard(accountDetails.ifscCode, "IFSC Code")}
                size="sm"
                variant="outline"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-center">Scan QR Code to Pay</h4>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Scan this QR code with your payment app to pay ₹1,000
            </p>
            <img
              src="/images/payment-qr.jpg"
              alt="Payment QR Code"
              className="max-w-xs mx-auto rounded-lg border-2 border-white/20"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<p class="text-muted-foreground">QR Code will be uploaded soon</p>';
                }
              }}
            />
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h5 className="font-semibold mb-2 text-blue-400">Important Note:</h5>
          <p className="text-sm text-muted-foreground">
            After making the payment, please keep the screenshot of the payment confirmation 
            and UTR number ready. You will need to submit these details during the registration process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
