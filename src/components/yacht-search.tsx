'use client';

import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { handleSmartSearch } from '@/lib/actions';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { YachtFilters } from './yacht-filters';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Finding...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Find
        </>
      )}
    </Button>
  );
}

export function YachtSearch() {
  const initialState = { result: '', error: '' };
  const [state, dispatch] = useActionState(handleSmartSearch, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <form action={dispatch} className="flex flex-col gap-4 sm:flex-row">
        <Input
          name="query"
          type="text"
          placeholder="e.g., 'Find me a sailing yacht under $500k in the Mediterranean'"
          className="flex-grow bg-white/90 text-gray-800 placeholder:text-gray-500"
          required
        />
        <SubmitButton />
      </form>
      
      <div className="mt-4 flex justify-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Refined Search
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:max-w-[400px] overflow-y-auto bg-background text-foreground">
            <SheetHeader>
              <SheetTitle>Refine Your Search</SheetTitle>
              <SheetDescription>
                Use the filters below to find the perfect yacht.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <YachtFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {state.result && (
        <Card className="mt-8 text-left bg-white/10 backdrop-blur-lg border border-gray-200/20">
          <CardHeader>
            <CardTitle className="text-white">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-200">{state.result}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
