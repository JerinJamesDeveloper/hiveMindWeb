'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { getSmartSuggestions } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Suggestion = {
  title: string;
  description: string;
};

export function SmartSuggestions() {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = () => {
    startTransition(async () => {
      setError(null);
      const result = await getSmartSuggestions();
      if (result.error) {
        setError(result.error);
        setSuggestions(null);
      } else if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Smart Suggestions</CardTitle>
            <CardDescription>AI-powered tips to optimize your home.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center text-center gap-4">
        {isPending ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Analyzing your usage...</p>
          </div>
        ) : suggestions ? (
          <div className="w-full text-left space-y-3 overflow-y-auto max-h-64 pr-2 -mt-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                <Lightbulb className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
           <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lightbulb className="h-8 w-8" />
            <p>Click the button to get personalized suggestions.</p>
          </div>
        )}
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Button onClick={handleGetSuggestions} disabled={isPending} className="w-full bg-accent hover:bg-accent/90">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Suggestions
        </Button>
      </div>
    </Card>
  );
}
