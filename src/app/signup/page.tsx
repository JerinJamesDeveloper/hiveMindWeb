'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/hooks/use-auth';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Sparkles,
  Rocket,
  Code,
  Users,
  Lightbulb,
  Zap,
  Heart,
  Trophy,
  BookOpen,
  Wifi,
  Shield
} from 'lucide-react';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { getErrorMessage } from '@/lib/utils';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { signup, user, loading: userLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();



  // Feature cards data for new users
  const featureCards = [
    {
      icon: Rocket,
      title: "Start Your IoT Journey",
      description: "Transform your ideas into reality. Whether you're building a smart home, industrial IoT, or the next big thing — we provide everything you need to succeed from day one.",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      highlights: [
        { icon: Code, text: "Arduino Library Included" },
        { icon: Wifi, text: "Instant Connectivity" },
        { icon: Zap, text: "Real-Time Dashboard" }
      ]
    },
    {
      icon: Lightbulb,
      title: "Minutes to First Device",
      description: "No complex setup. No weeks of coding. Just three lines of code and your ESP32 is connected. Our intelligent platform auto-generates your dashboard based on your data.",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      highlights: [
        { icon: BookOpen, text: "Step-by-Step Guides" },
        { icon: Shield, text: "Production Ready" },
        { icon: Sparkles, text: "Auto UI Generation" }
      ]
    },
    {
      icon: Heart,
      title: "Join the Community",
      description: "You're not alone. Join 2,500+ makers, students, and professionals building the future of IoT. Get help, share projects, and grow together.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      highlights: [
        { icon: Users, text: "Active Community" },
        { icon: Trophy, text: "Showcase Projects" },
        { icon: Heart, text: "24/7 Support" }
      ]
    }
  ];

  useEffect(() => {
    if (user && !userLoading) {
      router.push('/dashboard');
    }
  }, [user, userLoading, router]);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % featureCards.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => setIsHovered(false));
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovered(true));
        container.removeEventListener('mouseleave', () => setIsHovered(false));
      }
    };
  }, []);

  // 3D Tilt effect for feature card
  useEffect(() => {
    const handleCardMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      setCardTilt({ rotateX, rotateY });
    };

    const handleCardMouseLeave = () => {
      setCardTilt({ rotateX: 0, rotateY: 0 });
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleCardMouseMove);
      card.addEventListener('mouseleave', handleCardMouseLeave);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleCardMouseMove);
        card.removeEventListener('mouseleave', handleCardMouseLeave);
      }
    };
  }, [currentCard]);

  // Grid points for cursor effect
  const gridPoints = [];
  const gridSize = 60;
  for (let x = 0; x < 35; x++) {
    for (let y = 0; y < 20; y++) {
      gridPoints.push({ x: x * gridSize, y: y * gridSize, id: `${x}-${y}` });
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await signup({ email, password }, fullName);

      toast({
        title: '🎉 Welcome to HiveMind!',
        description: 'Your account has been created. Let\'s build something amazing!'
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Sign Up Failed',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    // TODO: Implement Google Signup with backend
    toast({
      title: 'Not Implemented',
      description: 'Google Sign Up is currently unavailable in this version.',
      variant: 'default',
    });
  };

  if (userLoading || user) {
    return <LoadingScreen />;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-[#030712] px-4"
    >
      {/* Interactive Background */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Cursor Glow */}
        {isHovered && (
          <div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-300"
            style={{
              left: mousePosition.x - 300,
              top: mousePosition.y - 300,
              background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)',
            }}
          />
        )}

        {/* Interactive Grid Points */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {isHovered && gridPoints.map((point) => {
            const distance = Math.sqrt(
              Math.pow(point.x - mousePosition.x, 2) +
              Math.pow(point.y - mousePosition.y, 2)
            );
            const maxDistance = 150;

            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * 0.4;
              const lineOpacity = (1 - distance / maxDistance) * 0.15;

              return (
                <g key={point.id}>
                  <line
                    x1={mousePosition.x}
                    y1={mousePosition.y}
                    x2={point.x}
                    y2={point.y}
                    stroke={`rgba(139, 92, 246, ${lineOpacity})`}
                    strokeWidth="1"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={2 + (1 - distance / maxDistance) * 2}
                    fill={`rgba(139, 92, 246, ${opacity})`}
                  />
                </g>
              );
            }
            return null;
          })}
          {isHovered && (
            <circle
              cx={mousePosition.x}
              cy={mousePosition.y}
              r="4"
              fill="rgba(139, 92, 246, 0.9)"
            />
          )}
        </svg>
      </div>

      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-purple-600/10 via-fuchsia-600/5 to-transparent blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] z-0" />
      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[100px] z-0" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm text-slate-400 hover:text-white hover:border-white/[0.15] transition-all duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-6">

        {/* Left Side - Signup Card */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-12 animate-fade-in-up">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-violet-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

          {/* Main Card */}
          <div className="relative bg-[#0a0a12]/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">

            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Card Header */}
            <div className="p-8 pb-6 space-y-6">
              {/* Logo */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-purple-500/30 rounded-full" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/20 flex items-center justify-center">
                    <Logo className="h-8 w-8 text-purple-400" />
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white mb-1">Join HiveMind</h1>
                  <p className="text-sm text-slate-400">Start building amazing IoT projects today</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-purple-400">Free Forever • No Credit Card</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-8 pb-8 space-y-6">
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-sm font-medium text-slate-300">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="Alex Ryder"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] rounded-xl text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] rounded-xl text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="pl-10 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] rounded-xl text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                </div>

                {/* Signup Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-violet-600 hover:from-purple-500 hover:via-fuchsia-400 hover:to-violet-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Create Account</span>
                      <Rocket className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0a0a12] px-3 text-slate-500 uppercase tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Signup */}
              <Button
                variant="outline"
                className="w-full h-12 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.15] text-white font-medium rounded-xl transition-all duration-300 group"
                onClick={handleGoogleSignup}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

              {/* Login Link */}
              <div className="pt-4 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-center text-slate-500 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free Tier Included</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>No Credit Card</span>
            </div>
          </div>
        </div>

        {/* Right Side - Rotating Feature Cards */}
        <div className="hidden lg:flex items-center justify-center perspective-1000 animate-fade-in-up-delayed">
          <div
            ref={cardRef}
            className="relative w-full max-w-lg h-[600px]"
            style={{
              transform: `perspective(1000px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            {featureCards.map((card, index) => {
              const CardIcon = card.icon;
              const isActive = index === currentCard;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${isActive
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-95 rotate-3 pointer-events-none'
                    }`}
                >
                  {/* Card Glow */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-3xl blur-2xl opacity-20`} />

                  {/* Main Card */}
                  <div className="relative h-full bg-[#0a0a12]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">

                    {/* Top Gradient Bar */}
                    <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />

                    {/* Card Content */}
                    <div className="p-10 h-full flex flex-col">

                      {/* Icon */}
                      <div className="mb-8">
                        <div className="relative inline-block">
                          <div className={`absolute inset-0 blur-2xl bg-gradient-to-r ${card.gradient} opacity-50 rounded-2xl`} />
                          <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} bg-opacity-10 border border-white/10 flex items-center justify-center`}>
                            <CardIcon className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl font-bold text-white mb-4">
                        {card.title}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-slate-400 leading-relaxed mb-8">
                        {card.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-4 flex-1">
                        {card.highlights.map((highlight, i) => {
                          const HighlightIcon = highlight.icon;
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-colors group">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <HighlightIcon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-medium text-slate-300">{highlight.text}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8 pt-6 border-t border-white/[0.06]">
                        <Button
                          className={`w-full h-12 bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:scale-[1.02]`}
                          onClick={() => {
                            const form = document.querySelector('form');
                            form?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Get Started Free
                        </Button>
                      </div>

                      {/* Progress Indicators */}
                      <div className="flex items-center justify-center gap-2 mt-6">
                        {featureCards.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentCard(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentCard
                              ? 'w-8 bg-gradient-to-r ' + card.gradient
                              : 'w-2 bg-white/20 hover:bg-white/30'
                              }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 -right-20 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
