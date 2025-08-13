
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Equipment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment</CardTitle>
        <CardDescription>Details about the yacht's equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form fields for Equipment will be implemented here */}
        <p className="text-muted-foreground">Equipment form fields will be here.</p>
      </CardContent>
    </Card>
  );
}
