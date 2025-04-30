
import * as XLSX from 'xlsx';

export const processExcelFile = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file'));
          return;
        }
        
        let workbook;
        const fileName = file.name.toLowerCase();
        
        if (fileName.endsWith('csv')) {
          // Handle CSV
          const csvText = data as string;
          workbook = XLSX.read(csvText, { type: 'string' });
        } else {
          // Handle Excel
          const arrayBuffer = data as ArrayBuffer;
          workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        }
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
        
        // Extract first column values, skip header row
        const values: string[] = [];
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (row && row[0] && typeof row[0] === 'string' || typeof row[0] === 'number') {
            values.push(String(row[0]).trim());
          }
        }
        
        resolve(values);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    if (file.name.toLowerCase().endsWith('csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
