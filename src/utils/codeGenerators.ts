
import { BarcodeType } from '@/components/CodeGenerator';

// Generate QR code using QRCode.js
export const generateQRCode = async (value: string): Promise<string> => {
  // Dynamically import QRCode.js
  const QRCode = await import('qrcode');
  
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(value, { 
      margin: 1,
      width: 200,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }, (err, url) => {
      if (err) reject(err);
      else resolve(url);
    });
  });
};

// Generate barcode using JsBarcode
export const generateBarcode = async (value: string, type: BarcodeType): Promise<string> => {
  // Dynamically import JsBarcode
  const JsBarcode = (await import('jsbarcode')).default;
  
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      
      // Generate the barcode
      JsBarcode(canvas, value, {
        format: type,
        lineColor: '#000000',
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        margin: 10,
        background: '#ffffff'
      });
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
};
