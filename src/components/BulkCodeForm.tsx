
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CodeType, BarcodeType, GeneratedCode } from './CodeGenerator';
import { generateQRCode, generateBarcode } from '@/utils/codeGenerators';
import { processExcelFile } from '@/utils/fileHandlers';
import { FileUp, QrCode, Barcode } from 'lucide-react';

interface BulkCodeFormProps {
  onCodesGenerated: (codes: GeneratedCode[]) => void;
  onClear: () => void;
}

const BulkCodeForm: React.FC<BulkCodeFormProps> = ({ onCodesGenerated, onClear }) => {
  const [file, setFile] = useState<File | null>(null);
  const [codeType, setCodeType] = useState<CodeType>('qrcode');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'csv') {
        setError('Please select an Excel or CSV file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setError('');
    setLoading(true);
    setProcessingStatus('Processing file...');
    
    try {
      const values = await processExcelFile(file);
      
      if (!values.length) {
        setError('No data found in the file or first column is empty');
        setLoading(false);
        return;
      }
      
      setProcessingStatus(`Generating codes: 0/${values.length}`);
      
      const codes: GeneratedCode[] = [];
      
      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (value) {
          let dataUrl = '';
          
          if (codeType === 'qrcode') {
            dataUrl = await generateQRCode(value);
          } else {
            dataUrl = await generateBarcode(value, barcodeType);
          }
          
          codes.push({
            dataUrl,
            value,
            type: codeType,
            barcodeType: codeType === 'barcode' ? barcodeType : undefined
          });
          
          setProcessingStatus(`Generating codes: ${i + 1}/${values.length}`);
        }
      }
      
      onCodesGenerated(codes);
    } catch (err) {
      setError('Failed to process file or generate codes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setProcessingStatus('');
    }
  };

  const handleClear = () => {
    setFile(null);
    setError('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="space-y-4">
        <div>
          <Label htmlFor="file">Upload Excel or CSV file</Label>
          <div className="mt-1">
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Only the first column will be used to generate codes
          </p>
        </div>
        
        <div>
          <Label>Code Type</Label>
          <RadioGroup 
            value={codeType} 
            onValueChange={(value) => setCodeType(value as CodeType)} 
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="qrcode" id="bulk-qrcode" />
              <Label htmlFor="bulk-qrcode" className="flex items-center gap-1 cursor-pointer">
                <QrCode size={16} /> QR Code
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="barcode" id="bulk-barcode" />
              <Label htmlFor="bulk-barcode" className="flex items-center gap-1 cursor-pointer">
                <Barcode size={16} /> Barcode
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {codeType === 'barcode' && (
          <div>
            <Label htmlFor="bulk-barcodeType">Barcode Type</Label>
            <Select 
              value={barcodeType} 
              onValueChange={(value) => setBarcodeType(value as BarcodeType)}
            >
              <SelectTrigger id="bulk-barcodeType" className="mt-1">
                <SelectValue placeholder="Select barcode type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="code128">Code 128</SelectItem>
                <SelectItem value="ean13">EAN-13</SelectItem>
                <SelectItem value="ean8">EAN-8</SelectItem>
                <SelectItem value="code39">Code 39</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {error && <div className="text-destructive text-sm">{error}</div>}
        {processingStatus && (
          <Alert>
            <AlertDescription>{processingStatus}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex space-x-2 pt-4">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? 'Processing...' : 'Generate Bulk Codes'}
            {!loading && <FileUp size={16} />}
          </Button>
          <Button type="button" onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BulkCodeForm;
