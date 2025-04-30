
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CodeGenerator from '@/components/CodeGenerator';

const Index = () => {
  return (
    <div className="app-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Code Forge</h1>
        <p className="text-muted-foreground mt-2">Generate QR codes and barcodes easily</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Image Factory</CardTitle>
          <CardDescription>
            Generate single or bulk QR codes and barcodes for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeGenerator />
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Separator />
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Code Forge Image Factory. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
