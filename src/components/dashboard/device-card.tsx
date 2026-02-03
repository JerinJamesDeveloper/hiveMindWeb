'use client';

import { useState, useRef, useEffect, MouseEvent, TouchEvent, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { Device } from '@/domain/models/device';
import { cn } from '@/lib/utils';
import {
  Lightbulb,
  Thermometer,
  Wind,
  Tv2,
  ToggleLeft,
  Power,
  Trash2,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteDevice } from '@/app/actions';

const iconMap: { [key: string]: React.ElementType } = {
  Lightbulb,
  Thermometer,
  Wind,
  Tv2,
  ToggleLeft,
};

function DeleteDeviceButton({ deviceId, userId }: { deviceId: string, userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDevice(deviceId, userId);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 z-10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#0a0a12] border border-white/[0.1] backdrop-blur-xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl text-white">Delete Device?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-slate-400 leading-relaxed">
            This action cannot be undone. This will permanently delete this device from your home automation system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl border-white/[0.1] hover:bg-white/[0.05]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl"
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete Device'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeviceCard({ device, userId }: { device: Device, userId: string }) {
  const [isOn, setIsOn] = useState(device.state !== 'off');
  const [intensity, setIntensity] = useState(typeof device.state === 'number' ? device.state : 80);
  const [tempValue, setTempValue] = useState(typeof device.state === 'number' ? device.state : 22);
  const [fanSpeed, setFanSpeed] = useState(typeof device.state === 'number' ? device.state : 3);

  const iconName = device.iconName;
  const Icon = iconName ? iconMap[iconName] : null;

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  // Light card
  if (device.type === 'light') {
    return (
      <div className="group relative">
        <DeleteDeviceButton deviceId={device.id} userId={userId} />

        <div
          className={cn(
            'relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
            isOn
              ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/20'
              : 'bg-white/[0.02] border border-white/[0.05]'
          )}
        >
          {/* Glow effect when on */}
          {isOn && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/30 rounded-full blur-[60px] animate-pulse" />
            </>
          )}

          {/* Top accent line */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
            isOn
              ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-100"
              : "opacity-0"
          )} />

          <div className="relative z-10 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                <p className="text-sm text-slate-400">{device.room}</p>
              </div>

              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                isOn
                  ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
                  : "bg-white/[0.05] border border-white/[0.05]"
              )}>
                {Icon && (
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-500",
                    isOn ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-slate-500"
                  )} />
                )}
              </div>
            </div>

            {/* Horizontal Slider for Light */}
            <div className={cn(
              "flex flex-col gap-4 py-4 transition-all duration-500",
              !isOn && "opacity-50 pointer-events-none"
            )}>
              {isOn ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Brightness</span>
                    </div>
                    <span className="text-sm font-bold text-white">{Math.round(intensity)}%</span>
                  </div>
                  <Slider
                    value={[intensity]}
                    max={100}
                    min={0}
                    step={1}
                    onValueChange={(vals) => setIntensity(vals[0])}
                    className="cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Moon className="w-10 h-10 text-slate-600 mb-2" />
                  <span className="text-xs text-slate-500 font-medium">Device is off</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isOn ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-600"
                )} />
                <span className="text-xs text-slate-400">
                  {isOn ? 'Active' : 'Inactive'}
                </span>
              </div>

              <Button
                size="icon"
                onClick={handleToggle}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-500 shadow-lg hover:scale-110",
                  isOn
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/50"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 border border-white/[0.05]"
                )}
              >
                <Power className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isOn && "rotate-180"
                )} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Thermostat card
  if (device.type === 'thermostat') {
    return (
      <div className="group relative">
        <DeleteDeviceButton deviceId={device.id} userId={userId} />

        <div
          className={cn(
            'relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
            isOn
              ? 'bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border border-orange-500/20'
              : 'bg-white/[0.02] border border-white/[0.05]'
          )}
        >
          {isOn && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 blur-xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px] animate-pulse" />
            </>
          )}

          <div className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
            isOn
              ? "bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-100"
              : "opacity-0"
          )} />

          <div className="relative z-10 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                <p className="text-sm text-slate-400">{device.room}</p>
              </div>

              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                isOn
                  ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
                  : "bg-white/[0.05] border border-white/[0.05]"
              )}>
                {Icon && (
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-500",
                    isOn ? "text-orange-400" : "text-slate-500"
                  )} />
                )}
              </div>
            </div>

            {isOn && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-1">{tempValue}°</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Target Temperature</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[tempValue]}
                    max={30}
                    min={10}
                    step={1}
                    onValueChange={(vals) => setTempValue(vals[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>10°C</span>
                    <span>30°C</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isOn ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" : "bg-slate-600"
                )} />
                <span className="text-xs text-slate-400">
                  {isOn ? 'Heating' : 'Off'}
                </span>
              </div>

              <Button
                size="icon"
                onClick={handleToggle}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-500 shadow-lg hover:scale-110",
                  isOn
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-orange-500/50"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 border border-white/[0.05]"
                )}
              >
                <Power className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isOn && "rotate-180"
                )} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fan card
  if (device.type === 'fan') {
    return (
      <div className="group relative">
        <DeleteDeviceButton deviceId={device.id} userId={userId} />

        <div
          className={cn(
            'relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
            isOn
              ? 'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20'
              : 'bg-white/[0.02] border border-white/[0.05]'
          )}
        >
          {isOn && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-[60px] animate-pulse" />
            </>
          )}

          <div className={cn(
            "absolute top-0 left-0 right-0 h-px transition-opacity duration-500",
            isOn
              ? "bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-100"
              : "opacity-0"
          )} />

          <div className="relative z-10 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                <p className="text-sm text-slate-400">{device.room}</p>
              </div>

              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
                isOn
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                  : "bg-white/[0.05] border border-white/[0.05]"
              )}>
                {Icon && (
                  <Icon className={cn(
                    "w-6 h-6 transition-all duration-500",
                    isOn ? "text-cyan-400 animate-spin" : "text-slate-500"
                  )} style={{ animationDuration: isOn ? `${6 - fanSpeed}s` : 'infinite' }} />
                )}
              </div>
            </div>

            {isOn && (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-1">{fanSpeed}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Speed Level</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[fanSpeed]}
                    max={5}
                    min={1}
                    step={1}
                    onValueChange={(vals) => setFanSpeed(vals[0])}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isOn ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-slate-600"
                )} />
                <span className="text-xs text-slate-400">
                  {isOn ? `Speed ${fanSpeed}` : 'Off'}
                </span>
              </div>

              <Button
                size="icon"
                onClick={handleToggle}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-500 shadow-lg hover:scale-110",
                  isOn
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/50"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 border border-white/[0.05]"
                )}
              >
                <Power className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isOn && "rotate-180"
                )} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card for other types
  return (
    <div className="group relative">
      <DeleteDeviceButton deviceId={device.id} userId={userId} />

      <div
        className={cn(
          'relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl',
          isOn
            ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20'
            : 'bg-white/[0.02] border border-white/[0.05]'
        )}
      >
        {isOn && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 blur-xl" />
        )}

        <div className="relative z-10 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">{device.name}</h3>
              <p className="text-sm text-slate-400">{device.room}</p>
            </div>

            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500",
              isOn
                ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30"
                : "bg-white/[0.05] border border-white/[0.05]"
            )}>
              {Icon && (
                <Icon className={cn(
                  "w-6 h-6 transition-all duration-500",
                  isOn ? "text-purple-400" : "text-slate-500"
                )} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isOn ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-slate-600"
              )} />
              <span className="text-xs text-slate-400">
                {isOn ? 'Active' : 'Inactive'}
              </span>
            </div>

            <Button
              size="icon"
              onClick={handleToggle}
              className={cn(
                "h-10 w-10 rounded-xl transition-all duration-500 shadow-lg hover:scale-110",
                isOn
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white shadow-purple-500/50"
                  : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 border border-white/[0.05]"
              )}
            >
              <Power className={cn(
                "h-5 w-5 transition-transform duration-300",
                isOn && "rotate-180"
              )} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}