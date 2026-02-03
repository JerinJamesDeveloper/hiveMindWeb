'use client';

import { useMemo } from 'react';
import { AnimatedLogo } from './animated-logo';
import {
  Cpu,
  Wifi,
  Bluetooth,
  Radio,
  Zap,
  Globe,
  Shield,
  Gauge,
  Activity,
  Command,
  Lightbulb,
  Thermometer,
  Wind,
  Lock,
  Smartphone,
  Laptop
} from 'lucide-react';

const techIcons = [
  Cpu, Wifi, Bluetooth, Radio, Zap, Globe, Shield, Gauge, 
  Activity, Command, Lightbulb, Thermometer, Wind, Lock, 
  Smartphone, Laptop
];

interface FloatingIcon {
  id: number;
  Icon: React.ElementType;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const colors = [
  'text-blue-400',
  'text-purple-400',
  'text-cyan-400',
  'text-emerald-400',
  'text-amber-400',
  'text-pink-400',
  'text-indigo-400',
  'text-teal-400'
];

// Function to check if point is far enough from center
const isFarFromCenter = (x: number, y: number, minDistance: number = 30): boolean => {
  const centerX = 50;
  const centerY = 50;
  const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  return distance > minDistance;
};

// Generate random position far from center
const getRandomPosition = (): { x: number; y: number } => {
  let x, y;
  let attempts = 0;
  const maxAttempts = 50;
  
  do {
    x = Math.random() * 90 + 5; // 5-95% to keep icons on screen
    y = Math.random() * 90 + 5;
    attempts++;
  } while (!isFarFromCenter(x, y, 30) && attempts < maxAttempts);
  
  return { x, y };
};

// Generate icons function
const generateIcons = (count: number): FloatingIcon[] => {
  const generatedIcons: FloatingIcon[] = [];

  for (let i = 0; i < count; i++) {
    const position = getRandomPosition();
    const Icon = techIcons[Math.floor(Math.random() * techIcons.length)];
    
    generatedIcons.push({
      id: i,
      Icon,
      x: position.x,
      y: position.y,
      size: Math.random() * 24 + 20, // 20-44px
      opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
      duration: Math.random() * 10 + 15, // 15-25s
      delay: Math.random() * 3, // 0-3s delay (reduced for faster appearance)
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  return generatedIcons;
};

export function LoadingScreen() {
  // Use useMemo to generate icons only once, immediately on render
  const icons = useMemo(() => generateIcons(14), []);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#030712] via-[#0a0a1a] to-[#030712] overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/5 via-purple-600/3 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[100px]" />

      {/* Floating Tech Icons */}
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute animate-float-random animate-fade-in"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            opacity: icon.opacity,
            willChange: 'transform'
          }}
        >
          <div className="relative group">
            {/* Icon Glow */}
            <div 
              className="absolute inset-0 blur-xl opacity-50 transition-opacity duration-500"
              style={{ 
                width: icon.size,
                height: icon.size
              }}
            >
              <icon.Icon 
                className={icon.color}
                size={icon.size}
              />
            </div>
            
            {/* Icon Container */}
            <div 
              className="relative rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] p-2 transition-all duration-500"
            >
              <icon.Icon 
                className={`${icon.color} animate-pulse-slow`}
                size={icon.size}
                style={{
                  animationDuration: `${icon.duration * 0.5}s`,
                  animationDelay: `${icon.delay * 0.5}s`
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Logo - Centered with higher z-index */}
      <div className="relative z-10 animate-fade-in">
        <AnimatedLogo />
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center animate-fade-in-up">
        <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm font-medium text-slate-400">Initializing HomeWise...</span>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes float-random {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-3deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(7deg);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .animate-float-random {
          animation: float-random ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}