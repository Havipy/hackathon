import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Share2, Download, Clipboard, Check, QrCode } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';

function QRGenerator() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  const generateQRCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Generate QR URL with a simple identifier
      const url = `${window.location.origin}/medical/demo`;
      setQrData(url);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please try again.');
    }
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = theme === 'dark' ? '#1f2937' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'medical-card-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const shareQR = async () => {
    if (!qrData || !canShare) {
      await copyToClipboard();
      return;
    }

    try {
      await navigator.share({
        title: 'Medical Card QR Code',
        text: 'Access my medical information',
        url: qrData
      });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        await copyToClipboard();
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border bg-card text-card-foreground shadow-lg">
        <div className="flex flex-col space-y-1.5 p-8">
          <div className="flex items-center gap-3">
            <QrCode className="h-7 w-7 text-pink-500" />
            <h1 className="text-2xl font-semibold">Medical Card QR</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate a QR code to securely share your medical information
          </p>
        </div>
        
        <div className="p-8 pt-0 space-y-8">
          <button
            onClick={generateQRCode}
            disabled={loading}
            className={cn(
              "w-full inline-flex items-center justify-center rounded-lg",
              "bg-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-sm",
              "hover:bg-pink-500 focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-offset-2 focus-visible:outline-pink-600",
              "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Medical Card QR'
            )}
          </button>

          {error && (
            <div className="rounded-lg bg-destructive/15 text-destructive p-4 text-sm" role="alert">
              {error}
            </div>
          )}

          {qrData && (
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div ref={qrRef} className="flex justify-center p-6 bg-white dark:bg-gray-800 rounded-lg mb-6">
                <QRCodeSVG
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                  className="mx-auto"
                  bgColor={theme === 'dark' ? '#1f2937' : '#ffffff'}
                  fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
                />
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={downloadQR}
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
                  title="Download QR"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={shareQR}
                  className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
                  title={canShare ? "Share" : "Copy to clipboard"}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;