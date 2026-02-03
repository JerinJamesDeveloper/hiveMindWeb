'use client';

import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { DeviceCard } from '@/components/dashboard/device-card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AddDeviceDialog } from '@/components/automations/add-device-dialog';
import { Badge } from '@/components/ui/badge';
import { IntegrationDialog } from '@/components/automations/integration-dialog';
import { useAuth } from '@/application/hooks/use-auth';
import { useDevices } from '@/application/hooks/use-devices';
import { useApiKeys } from '@/application/hooks/use-api-keys';
import { ApiKey } from '@/domain/models/api-key';
import { Device } from '@/domain/models/device';
import {
  Cpu,
  Key,
  AlertCircle,
  Sparkles,
  Zap,
  Grid3x3,
  Link as LinkIcon,
  Radio,
  ArrowRight
} from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/layout/loading-screen';

export default function AutomationsPage() {
  const { user, loading: userLoading } = useAuth();
  const { devices, loading: devicesLoading, refresh: refreshDevices } = useDevices();
  const { apiKeys, loading: apiKeysLoading } = useApiKeys();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (userLoading || devicesLoading || apiKeysLoading) {
    return <LoadingScreen />;
  }

  const currentUser = user ? {
    id: user.id || 'unknown',
    name: user.name || 'User',
    avatar: `https://i.pravatar.cc/150?u=${user.id}`
  } : { id: 'unknown', name: 'Guest', avatar: '' };

  const devicesByApiKey = apiKeys.map(apiKey => ({
    ...apiKey,
    devices: devices.filter(device => (device as any).apiKeyId === apiKey.id),
  }));

  const unassignedDevices = devices.filter(device => !(device as any).apiKeyId || !apiKeys.some(key => key.id === (device as any).apiKeyId));

  const totalDevices = devices.length;
  const activeDevices = devices.filter(d => d.status === 'online').length;

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#030712] via-[#0a0a1a] to-[#030712]">
      <AppSidebar />
      <SidebarInset>
        <Header user={currentUser} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-x-hidden">

          {/* Header Section */}
          <section className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10 border border-white/[0.05] backdrop-blur-xl p-6 md:p-8">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 animate-gradient-shift" />

              {/* Glow Effect */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="md:hidden p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05]" />
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                      <Grid3x3 className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Automation Hub</span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Devices & Automations
                  </h1>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{activeDevices} Active</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <span>{totalDevices} Total Devices</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user && apiKeys && <AddDeviceDialog userId={user.id} apiKeys={apiKeys} onSuccess={refreshDevices} />}
                </div>
              </div>
            </div>
          </section>

          {/* Empty State - No API Keys */}
          {apiKeys.length === 0 && devices.length === 0 && (
            <div className={`transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-12 md:p-16">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-amber-600/5 to-yellow-600/5" />

                <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                    <AlertCircle className="w-10 h-10 text-orange-400" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">No API Keys Found</h2>
                    <p className="text-lg text-slate-400">
                      You need to generate an API key first to connect and manage your devices.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      asChild
                      className="h-12 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <Link href="/dashboard">
                        <Key className="w-4 h-4 mr-2" />
                        Generate API Key
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices by API Key */}
          <div className="space-y-6">
            {devicesByApiKey.map((apiKey, index) => (
              apiKey.devices.length > 0 && (
                <section
                  key={apiKey.id}
                  className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/[0.05]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
                                <Key className="w-5 h-5 text-blue-400" />
                              </div>
                              <h2 className="text-xl font-bold text-white">{apiKey.name}</h2>
                            </div>

                            <Badge
                              variant="secondary"
                              className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-xs"
                            >
                              {apiKey.key.slice(0, 16)}...
                            </Badge>

                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <Radio className="w-3 h-3 text-emerald-400" />
                              <span className="text-xs font-medium text-emerald-400">
                                {apiKey.devices.length} Device{apiKey.devices.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>

                        <IntegrationDialog user={currentUser} apiKey={apiKey} devices={apiKey.devices} />
                      </div>
                    </div>

                    {/* Devices Grid */}
                    <div className="p-6 md:p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {apiKey.devices.map((device, deviceIndex) => (
                          <div
                            key={device.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${deviceIndex * 50}ms` }}
                          >
                            <DeviceCard device={device} userId={user!.id} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )
            ))}

            {/* Unassigned Devices */}
            {unassignedDevices.length > 0 && (
              <section className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                  {/* Header */}
                  <div className="p-6 md:p-8 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Unassigned Devices</h2>
                        <p className="text-sm text-slate-400">These devices are not linked to any API key</p>
                      </div>
                    </div>
                  </div>

                  {/* Devices Grid */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                      {unassignedDevices.map((device, index) => (
                        <div
                          key={device.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <DeviceCard device={device} userId={user!.id} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Empty State - No Devices */}
            {apiKeys.length > 0 && devices.length === 0 && !devicesLoading && (
              <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-12 md:p-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5" />

                  <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <Cpu className="w-10 h-10 text-blue-400" />
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">No Devices Yet</h2>
                      <p className="text-lg text-slate-400">
                        Start by adding your first ESP32 device to begin automating your smart home.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                      {user && (
                        <>
                          <AddDeviceDialog userId={user.id} apiKeys={apiKeys} onSuccess={refreshDevices} />
                          <Button
                            asChild
                            variant="outline"
                            className="h-12 px-8 border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] text-white rounded-xl font-semibold"
                          >
                            <Link href="/docs">
                              <Sparkles className="w-4 h-4 mr-2" />
                              View Documentation
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Quick Start Guide */}
                    <div className="mt-12 pt-8 border-t border-white/[0.05]">
                      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Start</h3>
                      <div className="grid sm:grid-cols-3 gap-4 text-left">
                        {[
                          { step: '1', title: 'Add Device', desc: 'Click "Add Device" button', icon: Cpu },
                          { step: '2', title: 'Configure', desc: 'Set name and API key', icon: LinkIcon },
                          { step: '3', title: 'Connect', desc: 'Flash code to ESP32', icon: Zap }
                        ].map((item, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-bold text-blue-400">Step {item.step}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
