'use client';

import Image from 'next/image';

/**
 * This is the component for your custom animated logo.
 * 
 * HOW TO USE:
 * 1. Replace the content of this component with your own animated logo.
 *    This could be an SVG animation, a Lottie animation, or any other React component.
 * 2. The LoadingScreen component will automatically use your new logo.
 */
export function AnimatedLogo() {
  return (
    <div className="relative w-60 h-60">
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl animate-pulse"
      />
      
      {/* The main logo image */}
      <Image
        src="/image/logowhite.png"
        alt="HomeWise Logo"
        width={230}
        height={230}
        className="relative animate-pulse"
        priority
      />
    </div>
  );
}
