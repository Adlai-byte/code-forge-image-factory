
import JSZip from 'jszip';
import { GeneratedCode } from '@/components/CodeGenerator';

/**
 * Creates a zip file containing all the generated code images
 * @param codes Array of generated codes to include in the zip
 * @returns Promise resolving to the zip file as a Blob
 */
export const createCodesZipFile = async (codes: GeneratedCode[]): Promise<Blob> => {
  const zip = new JSZip();
  
  // Add each code image to the zip
  codes.forEach((code, index) => {
    // Extract the base64 data from the data URL
    const base64Data = code.dataUrl.split(',')[1];
    
    // Create a filename for each image
    const filename = `${code.value}-${code.type}${code.barcodeType ? `-${code.barcodeType}` : ''}.png`;
    
    // Add the file to the zip
    zip.file(filename, base64Data, { base64: true });
  });
  
  // Generate the zip file as a blob
  return await zip.generateAsync({ type: 'blob' });
};
