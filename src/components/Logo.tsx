
import React from 'react';
import { QrCode, Barcode } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-1 items-center bg-gradient-to-r from-primary/80 to-blue-600/80 p-2 rounded-lg shadow-md">
        <QrCode size={28} className="text-white" />
        <Barcode size={28} className="text-white" />
        <span className="font-bold text-xl text-white ml-1">CodeForge</span>
      </div>
    </div>
  );
};

export default Logo;
