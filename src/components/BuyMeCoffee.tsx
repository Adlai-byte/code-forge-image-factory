
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

const BuyMeCoffee = ({ className }: { className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className={cn(
            "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-amber-400",
            className
          )}
        >
          <Coffee className="mr-1" size={18} />
          Buy Me a Coffee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Support the Developer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-center mb-4 text-muted-foreground">
            If you find this tool useful, consider buying me a coffee!
          </p>
          <div className="bg-white p-2 rounded-md shadow-md">
            <img 
              src="/lovable-uploads/204b1690-3d28-4b78-8a87-16739ab81b40.png" 
              alt="Payment QR Code" 
              className="max-w-full h-auto"
              style={{ maxHeight: "400px" }}
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scan the QR code with your payment app to support this project.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyMeCoffee;
