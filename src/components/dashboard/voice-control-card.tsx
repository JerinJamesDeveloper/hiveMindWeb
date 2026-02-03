import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';

const VoiceAssistantIcon = ({ path, viewBox, className }: { path: string; viewBox: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} fill="currentColor">
    <path d={path} />
  </svg>
);

export function VoiceControlCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Voice Control</CardTitle>
            <CardDescription>Control your home with your voice.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center gap-4 h-full pt-0">
        <div className="flex items-center gap-6 text-muted-foreground/70">
          <VoiceAssistantIcon
            className="h-10 w-10"
            viewBox="0 0 24 24"
            path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.25-7.53L7.7 13.5l1.06-1.06 2.19 2.19 4.94-4.94 1.06 1.06-6 6z"
          />
           <VoiceAssistantIcon
            className="h-9 w-9"
            viewBox="0 0 24 24"
            path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
          />
        </div>
        <p className="text-sm font-medium text-foreground mt-2">
          Connected with Amazon Alexa & Google Assistant
        </p>
      </CardContent>
    </Card>
  );
}
