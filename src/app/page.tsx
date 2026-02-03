import { LandingHeader } from '@/components/landing/landing-header';
import { Hero } from '@/components/landing/hero';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
      </main>
    </div>
  );
}
