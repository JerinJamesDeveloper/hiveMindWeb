'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code, Copy, Check, Download, Sparkles } from 'lucide-react';
import type { ApiKey, Device, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function generateArduinoCode(user: User, apiKey: ApiKey, devices: Device[]): string {
  // Generate device registrations
  const deviceRegistrations = devices
    .map((device, index) => {
      const deviceId = device.id;
      const deviceType = device.type === 'light' ? 'bulb' : device.type;
      const pin = 16 + index; // Sequential GPIO pins starting from 16
      
      let deviceCode = '';
      
      switch (device.type) {
        case 'light':
          deviceCode = `  home.addDevice("${deviceId}", TYPE_BULB, ${pin}, RELAY_ACTIVE_LOW);`;
          break;
        case 'fan':
          deviceCode = `  home.addDevice("${deviceId}", TYPE_FAN, ${pin}, 0, RELAY_ACTIVE_HIGH);`;
          break;
        case 'thermostat':
          deviceCode = `  home.addDevice("${deviceId}", TYPE_AC, ${pin}, RELAY_ACTIVE_LOW);`;
          break;
        default:
          deviceCode = `  home.addDevice("${deviceId}", TYPE_BULB, ${pin}, RELAY_ACTIVE_LOW);`;
      }
      
      return deviceCode;
    })
    .join('\n');

  // Extract first 12 chars of API key or pad if shorter
  const keyCode = apiKey.key.substring(0, 12).toUpperCase();

  return `/*
 * HomeWise ESP32 Configuration
 * 
 * Device: ${user.name || 'Smart Home Hub'}
 * API Key: ${apiKey.name}
 * Devices: ${devices.length} configured
 * 
 * Generated: ${new Date().toLocaleString()}
 */

#include <HiveMind.h>

HiveMind home;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // ══════════════════════════════════════════
  // REQUIRED CONFIGURATION
  // ══════════════════════════════════════════

  // WiFi credentials
  home.setWiFi("YOUR_WIFI_SSID", "YOUR_WIFI_PASSWORD");

  // Unique device ID
  home.setDeviceId("${user.id}");

  // KeyCode from your platform (12 characters)
  home.setKeyCode("${keyCode}");

  // ══════════════════════════════════════════
  // YOUR CONFIGURED DEVICES
  // ══════════════════════════════════════════

${deviceRegistrations}

  // ══════════════════════════════════════════
  // START SYSTEM
  // ══════════════════════════════════════════

  Serial.println("\\n╔════════════════════════════════════════╗");
  Serial.println("║       HomeWise Device Starting...      ║");
  Serial.println("╚════════════════════════════════════════╝\\n");

  if (!home.begin()) {
    Serial.println("❌ Initialization failed!");
    Serial.println("Please check your configuration and try again.");
    while (true) delay(1000);
  }

  Serial.println("✓ System initialized successfully");
  Serial.println("✓ Connected to WiFi");
  Serial.println("✓ MQTT connection established");
  Serial.println("✓ All devices registered\\n");
  Serial.println("Ready to receive commands!");
}

void loop() {
  home.loop();
}

/*
 * DEVICE CONFIGURATION REFERENCE
 * ══════════════════════════════════════════
 * 
 * Your configured devices:
${devices.map((d, i) => ` * ${i + 1}. ${d.name} (${d.type}) - Pin ${16 + i} - Room: ${d.room}`).join('\n')}
 * 
 * PIN MAPPING:
 * ══════════════════════════════════════════
 * Make sure these GPIO pins are available on your ESP32.
 * Adjust pin numbers in addDevice() calls if needed.
 * 
 * RELAY MODES:
 * - RELAY_ACTIVE_LOW: Relay turns ON when pin is LOW
 * - RELAY_ACTIVE_HIGH: Relay turns ON when pin is HIGH
 * 
 * DEVICE TYPES:
 * - TYPE_BULB: Simple on/off light control
 * - TYPE_FAN: Fan with speed control (requires PWM)
 * - TYPE_AC: Air conditioner/thermostat control
 */`;
}

export function IntegrationDialog({ user, apiKey, devices }: { user: User, apiKey: ApiKey; devices: Device[] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const code = generateArduinoCode(user, apiKey, devices);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: '✨ Code Copied!',
      description: 'The integration code has been copied to your clipboard.',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homewise_${apiKey.name.toLowerCase().replace(/\s/g, '_')}.ino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: '📥 Downloaded!',
      description: 'Arduino sketch file has been downloaded.',
    });
  };

  const highlightCode = (code: string) => {
    return code
      .split('\n')
      .map((line, i) => {
        let highlighted = line
          // Comments (both // and /* */)
          .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500">$1</span>')
          // Strings
          .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
          // Keywords
          .replace(/\b(#include|void|if|while|true|delay)\b/g, '<span class="text-purple-400">$1</span>')
          // Constants and types
          .replace(/\b(TYPE_BULB|TYPE_FAN|TYPE_AC|RELAY_ACTIVE_LOW|RELAY_ACTIVE_HIGH|Serial|HiveMind|home)\b/g, '<span class="text-cyan-400">$1</span>')
          // Function names
          .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="text-blue-400">$1</span>(')
          // Numbers
          .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>');
        
        return (
          <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
            <span className="w-12 flex-shrink-0 text-right pr-4 text-slate-600 select-none border-r border-white/[0.05]">
              {i + 1}
            </span>
            <span 
              className="flex-1 pl-4 whitespace-pre"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/30 text-blue-400 transition-all duration-300"
        >
          <Code className="mr-2 h-4 w-4" />
          Get Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-[#0a0a12] border border-white/[0.1] backdrop-blur-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative overflow-hidden p-6 border-b border-white/[0.05]">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  ESP32 Integration Code
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {apiKey.name} • {devices.length} device{devices.length !== 1 ? 's' : ''} configured
                </DialogDescription>
              </div>
            </div>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">HiveMind Library</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs font-medium text-blue-400 font-mono">ESP32 Ready</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-xs font-medium text-purple-400">GPIO {16}-{15 + devices.length}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Code Section - Scrollable */}
        <div className="relative flex-1 overflow-hidden">
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] rounded-lg text-slate-300 hover:text-white transition-all"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 px-3 rounded-lg transition-all ${
                copied 
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] text-slate-300 hover:text-white'
              }`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Code Container - Scrollable both ways */}
          <div className="h-[500px] overflow-auto p-6 pt-16">
            <div className="relative rounded-2xl bg-[#0d1117] border border-white/[0.05] overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.05]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-xs text-slate-500 font-mono">
                  homewise_{apiKey.name.toLowerCase().replace(/\s/g, '_')}.ino
                </span>
              </div>

              {/* Code Content - Scrollable */}
              <div className="overflow-auto max-h-[400px]">
                <pre className="p-4 text-sm font-mono leading-relaxed text-slate-300">
                  <code>
                    {highlightCode(code)}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative overflow-hidden p-6 border-t border-white/[0.05] bg-white/[0.01]">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Quick Setup Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { step: '1', title: 'Install HiveMind Library', desc: 'Add library via Arduino IDE Library Manager' },
                { step: '2', title: 'Update WiFi Credentials', desc: 'Replace YOUR_WIFI_SSID and YOUR_WIFI_PASSWORD' },
                { step: '3', title: 'Flash & Monitor', desc: 'Upload code and open Serial Monitor (115200 baud)' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-400">{item.step}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-white mb-0.5">{item.title}</h5>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          /* Custom scrollbar for code area */
          .overflow-auto::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          .overflow-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
          }
          
          .overflow-auto::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          
          .overflow-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .overflow-auto::-webkit-scrollbar-corner {
            background: transparent;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}