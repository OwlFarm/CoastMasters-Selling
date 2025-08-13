
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Rigging() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rigging</CardTitle>
        <CardDescription>Details about the yacht's rigging and sails.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form fields for Rigging will be implemented here */}
        <p className="text-muted-foreground">Rigging form fields will be here.</p>
      </CardContent>
    </Card>
  );
}
