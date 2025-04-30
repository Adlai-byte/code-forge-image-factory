
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SingleCodeForm from './SingleCodeForm';
import BulkCodeForm from './BulkCodeForm';
import CodePreview from './CodePreview';

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
          <h3 className="text-lg font-medium mb-4">
            {generatedCodes.length === 1 ? 'Generated Code' : `Generated Codes (${generatedCodes.length})`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
