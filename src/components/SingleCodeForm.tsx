
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeType, BarcodeType, GeneratedCode } from './CodeGenerator';
import { generateQRCode, generateBarcode } from '@/utils/codeGenerators';
import { QrCode, Barcode } from 'lucide-react';

interface SingleCodeFormProps {
  onCodeGenerated: (code: GeneratedCode) => void;
  onClear: () => void;
}

const SingleCodeForm: React.FC<SingleCodeFormProps> = ({ onCodeGenerated, onClear }) => {
  const [value, setValue] = useState('');
  const [codeType, setCodeType] = useState<CodeType>('qrcode');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('code128');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setError('Please enter a value');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      let dataUrl = '';
      
      if (codeType === 'qrcode') {
        dataUrl = await generateQRCode(value);
      } else {
        dataUrl = await generateBarcode(value, barcodeType);
      }
      
      onCodeGenerated({
        dataUrl,
        value,
        type: codeType,
        barcodeType: codeType === 'barcode' ? barcodeType : undefined
      });
    } catch (err) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValue('');
    setError('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="space-y-4">
        <div>
          <Label htmlFor="value">Enter text or URL</Label>
          <Input
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter text, URL, or data"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>Code Type</Label>
          <RadioGroup 
            value={codeType} 
            onValueChange={(value) => setCodeType(value as CodeType)} 
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="qrcode" id="qrcode" />
              <Label htmlFor="qrcode" className="flex items-center gap-1 cursor-pointer">
                <QrCode size={16} /> QR Code
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="barcode" id="barcode" />
              <Label htmlFor="barcode" className="flex items-center gap-1 cursor-pointer">
                <Barcode size={16} /> Barcode
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {codeType === 'barcode' && (
          <div>
            <Label htmlFor="barcodeType">Barcode Type</Label>
            <Select 
              value={barcodeType} 
              onValueChange={(value) => setBarcodeType(value as BarcodeType)}
            >
              <SelectTrigger id="barcodeType" className="mt-1">
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
        
        <div className="flex space-x-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Code'}
          </Button>
          <Button type="button" onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SingleCodeForm;
