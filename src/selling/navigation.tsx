
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Navigation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigation</CardTitle>
        <CardDescription>Details about the yacht's navigation equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form fields for Navigation will be implemented here */}
        <p className="text-muted-foreground">Navigation form fields will be here.</p>
      </CardContent>
    </Card>
  );
}
