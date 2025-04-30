
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CodeGenerator from '@/components/CodeGenerator';
import { QrCode, Barcode } from 'lucide-react';
import Logo from '@/components/Logo';
import BuyMeCoffee from '@/components/BuyMeCoffee';

const Index = () => {
  return <div className="app-container">
      <div className="mb-8">
        <Logo />
        <p className="text-muted-foreground mt-2 text-center">Generate QR codes and barcodes easily</p>
      </div>
      
      <Card className="shadow-lg border-primary/20 bg-gradient-to-b from-card to-card/95">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <QrCode size={24} className="text-primary" />
                <Barcode size={24} className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Code Forge</CardTitle>
                <CardDescription>
                  Generate single or bulk QR codes and barcodes for your needs
                </CardDescription>
              </div>
            </div>
            <BuyMeCoffee className="ml-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CodeGenerator />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Separator className="my-4" />
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Code Forge Image Factory. All rights reserved.</p>
        </footer>
      </div>
    </div>;
};
export default Index;
