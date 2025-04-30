
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SingleCodeForm from './SingleCodeForm';
import BulkCodeForm from './BulkCodeForm';
import CodePreview from './CodePreview';
import { Download, Gallery } from 'lucide-react';

export type CodeType = 'qrcode' | 'barcode';
export type BarcodeType = 'code128' | 'ean13' | 'ean8' | 'code39';

export interface GeneratedCode {
  dataUrl: string;
  value: string;
  type: CodeType;
  barcodeType?: BarcodeType;
}

const CodeGenerator = () => {
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [activeTab, setActiveTab] = useState<string>('single');

  const handleSingleCodeGenerated = (code: GeneratedCode) => {
    setGeneratedCodes([code]);
  };

  const handleBulkCodesGenerated = (codes: GeneratedCode[]) => {
    setGeneratedCodes(codes);
  };

  const clearGeneratedCodes = () => {
    setGeneratedCodes([]);
  };

  const handleBulkDownload = () => {
    if (generatedCodes.length === 0) return;
    
    // Use setTimeout to prevent UI freezing when handling many downloads
    generatedCodes.forEach((code, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = code.dataUrl;
        link.download = `${code.value}-${code.type}${code.barcodeType ? `-${code.barcodeType}` : ''}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100); // Add a small delay between downloads
    });
  };

  return (
    <div>
      <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Code</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="tab-content">
          <SingleCodeForm onCodeGenerated={handleSingleCodeGenerated} onClear={clearGeneratedCodes} />
        </TabsContent>
        
        <TabsContent value="bulk" className="tab-content">
          <BulkCodeForm onCodesGenerated={handleBulkCodesGenerated} onClear={clearGeneratedCodes} />
        </TabsContent>
      </Tabs>

      {generatedCodes.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {generatedCodes.length === 1 ? 'Generated Code' : `Generated Codes (${generatedCodes.length})`}
            </h3>
            {generatedCodes.length > 1 && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleBulkDownload}
                className="flex items-center gap-2"
              >
                <Download size={16} /> Download All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedCodes.map((code, index) => (
              <CodePreview 
                key={index} 
                code={code} 
                showFileName={generatedCodes.length > 1} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
