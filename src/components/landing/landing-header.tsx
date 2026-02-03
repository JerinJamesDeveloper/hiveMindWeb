'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-white">HomeWise</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="outline" className="text-white border-white/50 bg-white/10 hover:bg-white/20 hover:text-white" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
