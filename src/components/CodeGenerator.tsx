
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SingleCodeForm from './SingleCodeForm';
import BulkCodeForm from './BulkCodeForm';
import CodePreview from './CodePreview';
import { Download, ImageIcon, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createCodesZipFile } from '@/utils/zipUtils';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleSingleCodeGenerated = (code: GeneratedCode) => {
    setGeneratedCodes([code]);
  };

  const handleBulkCodesGenerated = (codes: GeneratedCode[]) => {
    setGeneratedCodes(codes);
  };

  const clearGeneratedCodes = () => {
    setGeneratedCodes([]);
  };

  const handleSingleDownload = (code: GeneratedCode) => {
    const link = document.createElement('a');
    link.href = code.dataUrl;
    link.download = `${code.value}-${code.type}${code.barcodeType ? `-${code.barcodeType}` : ''}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = async () => {
    if (generatedCodes.length === 0) return;
    
    try {
      setIsDownloading(true);
      
      // Create a zip file containing all codes
      const zipBlob = await createCodesZipFile(generatedCodes);
      
      // Create a download link for the zip file
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `codes-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download complete",
        description: `${generatedCodes.length} codes have been downloaded as a ZIP file.`,
      });
    } catch (error) {
      console.error("Error creating zip file:", error);
      toast({
        title: "Download failed",
        description: "There was an error creating the zip file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <FileArchive size={16} /> 
                {isDownloading ? 'Creating ZIP...' : 'Download as ZIP'}
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
