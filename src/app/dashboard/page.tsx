'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/application/hooks/use-auth';
import { useDevices } from '@/application/hooks/use-devices';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SmartSuggestions } from '@/components/dashboard/smart-suggestions';
import { VoiceControlCard } from '@/components/dashboard/voice-control-card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ConnectHive } from '@/components/dashboard/connect-hive';
import { EnergyUsage } from '@/components/dashboard/energy-usage';
import {
  Zap,
  Cpu,
  Activity,
  TrendingUp,
  Wifi,
  Shield,
  Clock,
  BarChart3,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/layout/loading-screen';
import { Key } from 'lucide-react';

function NoDevicesWelcome() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-white/[0.05] backdrop-blur-xl p-8 md:p-10">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-gradient-shift" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Welcome to HiveMind</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Your Smart Home Awaits
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          It looks like you don't have any devices yet. Add your first device to see your dashboard come to life.
        </p>
        <div className="pt-4">
          <Button
            asChild
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/automations">
              <Cpu className="mr-2 h-4 w-4" />
              Add Your First Device
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


export default function Home() {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { devices, loading: devicesLoading } = useDevices();

  // API Keys logic needs migration too, for now we stub it or assume true/false
  const hasApiKeys = true; // Placeholder until ApiKeyService is migrated

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user || devicesLoading) {
    return <LoadingScreen />;
  }

  const currentUser = {
    id: user.id, // mapped from user.id
    name: user.name || 'User',
    avatar: `https://i.pravatar.cc/150?u=${user.id}`
  }

  const hasDevices = devices && devices.length > 0;
  const deviceCount = devices?.length || 0;

  // Mock stats - replace with real data
  const stats = [
    {
      label: 'Active Devices',
      value: deviceCount.toString(),
      change: '+2 this week',
      icon: Cpu,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      label: 'Energy Saved',
      value: '24%',
      change: '+5% from last month',
      icon: Zap,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      label: 'Response Time',
      value: '42ms',
      change: 'Optimal',
      icon: Activity,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      label: 'Automation Runs',
      value: '1.2K',
      change: '+18% this week',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/10 to-amber-500/10'
    }
  ];

  const quickActions = [
    { label: 'Add Device', icon: Cpu, href: '/automations', color: 'blue' },
    { label: 'Create Scene', icon: Sparkles, href: '/scenes/new', color: 'purple' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics', color: 'emerald' },
    { label: 'Settings', icon: Shield, href: '/settings', color: 'slate' }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#030712] via-[#0a0a1a] to-[#030712]">
      <AppSidebar />
      <SidebarInset>
        <Header user={currentUser} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-x-hidden">
          <div className={`space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

            <ConnectHive />

            {hasDevices ? (
              <>
                {/* Stats Grid */}
                <section className={`transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6 hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: mounted ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                        }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <stat.icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${stat.gradient}`} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300 origin-left">
                              {stat.value}
                            </div>
                            <div className="text-sm text-slate-500 mb-2">{stat.label}</div>
                            <div className="text-xs text-emerald-400 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {stat.change}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Actions */}
                <section className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      Quick Actions
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action, index) => (
                      <Link
                        key={index}
                        href={action.href}
                        className="group relative overflow-hidden rounded-xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-4 hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                          <div className={`w-12 h-12 rounded-xl bg-${action.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                          </div>
                          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                            {action.label}
                          </span>
                        </div>
                        <ChevronRight className="absolute top-2 right-2 w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Main Content Grid */}
                <section className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="space-y-6">
                    <EnergyUsage />
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                      <SmartSuggestions />
                      <VoiceControlCard />
                    </div>
                  </div>
                </section>
              </>
            ) : (
              !hasApiKeys && <NoDevicesWelcome />
            )}

            {hasDevices && (
              <section className={`transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      System Status
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      All Systems Operational
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'MQTT Connection', status: 'Connected', icon: Wifi, color: 'emerald' },
                      { label: 'Cloud Sync', status: 'Active', icon: Clock, color: 'blue' },
                      { label: 'Security', status: 'Protected', icon: Shield, color: 'purple' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                          <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{item.label}</div>
                          <div className={`text-xs text-${item.color}-400`}>{item.status}</div>
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </SidebarInset>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
