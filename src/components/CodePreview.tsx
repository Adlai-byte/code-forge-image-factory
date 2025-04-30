
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GeneratedCode } from './CodeGenerator';
import { Download } from 'lucide-react';

interface CodePreviewProps {
  code: GeneratedCode;
  showFileName?: boolean;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code, showFileName = false }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = code.dataUrl;
    link.download = `${code.value}-${code.type}${code.barcodeType ? `-${code.barcodeType}` : ''}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const truncateValue = (value: string, maxLength = 20) => {
    return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
  };

  return (
    <Card className="code-preview">
      <CardContent className="px-0 py-2 flex flex-col items-center">
        <div className="preview-image-container w-full flex justify-center">
          <img 
            src={code.dataUrl} 
            alt={`${code.type} for ${code.value}`} 
            className="preview-image"
            style={{ maxHeight: '180px' }}
          />
        </div>
        {showFileName && (
          <div className="mt-2 text-sm font-medium text-center">
            {truncateValue(code.value)}
          </div>
        )}
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          size="sm" 
          className="download-button mt-2"
        >
          <Download size={16} /> Download
        </Button>
      </CardContent>
    </Card>
  );
};

export default CodePreview;
