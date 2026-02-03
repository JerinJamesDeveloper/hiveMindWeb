'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Wifi, 
  Bluetooth,
  Code2,
  Gauge,
  Shield,
  Cpu,
  Radio,
  LineChart,
  Layers,
  Terminal,
  Box,
  ChevronDown,
  Github,
  BookOpen,
  Sparkles,
  Clock,
  Users,
  Globe
} from 'lucide-react';

export function Hero() {
  
  const [isTyping, setIsTyping] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullText = "Focus on Hardware. We Handle the Rest.";
  const [text] = useState(fullText);

  // Intersection Observer for scroll animations
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(sectionId);
              } else {
                newSet.delete(sectionId);
              }
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px',
      }
    );

    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Mouse tracking for hero
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

  // Grid points for cursor effect
  const gridPoints = [];
  const gridSize = 60;
  for (let x = 0; x < 35; x++) {
    for (let y = 0; y < 20; y++) {
      gridPoints.push({ x: x * gridSize, y: y * gridSize, id: `${x}-${y}` });
    }
  }

  // Code examples for the library section
  const codeExamples = [
    {
      title: "Initialize in 3 Lines",
      language: "cpp",
      code: `#include <HomeWise.h>

HomeWise device("your-api-key");

void setup() {
  device.begin("My ESP32 Device");
  device.connect(); // Auto WiFi + MQTT
}`
    },
    {
      title: "Send Real-Time Data",
      language: "cpp", 
      code: `void loop() {
  float temp = readSensor();
  
  device.send("temperature", temp);
  device.send("humidity", 65.5);
  
  // That's it. See it live on dashboard.
  delay(1000);
}`
    },
    {
      title: "Receive Commands",
      language: "cpp",
      code: `device.onCommand("led", [](String value) {
  if (value == "on") {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
});

// Control from anywhere in the world`
    }
  ];

  const features = [
    {
      icon: Wifi,
      title: "WiFi Auto-Connect",
      description: "Smart WiFi manager with captive portal. No hardcoded credentials needed.",
      color: "blue"
    },
    {
      icon: Bluetooth,
      title: "BLE Provisioning",
      description: "Configure devices via Bluetooth. Perfect for headless deployments.",
      color: "purple"
    },
    {
      icon: Radio,
      title: "MQTT Protocol",
      description: "Real-time bidirectional communication with sub-100ms latency.",
      color: "cyan"
    },
    {
      icon: Shield,
      title: "TLS Encryption",
      description: "End-to-end encryption. Your data never touches our servers unencrypted.",
      color: "emerald"
    },
    {
      icon: Gauge,
      title: "OTA Updates",
      description: "Push firmware updates remotely. No physical access required.",
      color: "amber"
    },
    {
      icon: Layers,
      title: "Auto UI Generation",
      description: "Dashboard widgets are auto-generated based on your data types.",
      color: "pink"
    }
  ];

  const stats = [
    { value: "50K+", label: "Devices Connected", icon: Cpu },
    { value: "<50ms", label: "Average Latency", icon: Zap },
    { value: "99.99%", label: "Uptime SLA", icon: Clock },
    { value: "2.5K+", label: "Developers", icon: Users }
  ];

  return (
    <div className="bg-[#030712] text-white w-full overflow-x-hidden">
      
      {/* ============================================ */}
      {/* SECTION 1: HERO */}
      {/* ============================================ */}
      <section 
        ref={(el) => {
          if (el) sectionRefs.current.set('hero', el);
        }}
        data-section="hero"
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Interactive Background Grid */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {isHovered && (
            <div 
              className="absolute w-[800px] h-[800px] rounded-full pointer-events-none transition-all duration-300"
              style={{
                left: mousePosition.x - 400,
                top: mousePosition.y - 400,
                background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)',
              }}
            />
          )}
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {isHovered && gridPoints.map((point) => {
              const distance = Math.sqrt(
                Math.pow(point.x - mousePosition.x, 2) + 
                Math.pow(point.y - mousePosition.y, 2)
              );
              const maxDistance = 180;
              
              if (distance < maxDistance) {
                const opacity = (1 - distance / maxDistance) * 0.5;
                const lineOpacity = (1 - distance / maxDistance) * 0.2;
                
                return (
                  <g key={point.id}>
                    <line
                      x1={mousePosition.x}
                      y1={mousePosition.y}
                      x2={point.x}
                      y2={point.y}
                      stroke={`rgba(59, 130, 246, ${lineOpacity})`}
                      strokeWidth="1"
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={2 + (1 - distance / maxDistance) * 3}
                      fill={`rgba(59, 130, 246, ${opacity})`}
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
                r="5"
                fill="rgba(59, 130, 246, 0.9)"
              />
            )}
          </svg>
        </div>
        
        {/* Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-blue-600/8 via-purple-600/4 to-transparent blur-3xl z-0" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] z-0" />
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] z-0" />

        <div ref={containerRef} className="relative z-10 px-6">
          <div className="text-center w-full">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-8 animate-fade-in-down">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">ESP32</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">WiFi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bluetooth className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-slate-400">BLE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">MQTT</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="min-h-[120px] sm:min-h-[160px] mb-6 flex items-center justify-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] animate-fade-in-up animation-delay-100">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                  {text}
                </span>
                <span 
                  className={`ml-2 inline-block w-[5px] h-[0.85em] bg-gradient-to-b from-blue-400 to-cyan-500 align-middle rounded-full ${isTyping ? 'animate-blink' : 'opacity-0'}`} 
                />
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
              The complete IoT platform for ESP32. Our Arduino library handles{' '}
              <span className="text-blue-400">WiFi</span>,{' '}
              <span className="text-purple-400">BLE</span>,{' '}
              <span className="text-cyan-400">MQTT</span>, and{' '}
              <span className="text-emerald-400">UI</span> — 
              so you can focus on building amazing hardware.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-300">
              <Button 
                size="lg" 
                className="h-14 px-10 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full transition-all duration-300 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.6)] hover:scale-[1.02]"
                asChild
              >
                <Link href="/login">
                  Start Building Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-10 text-base font-semibold border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-white rounded-full transition-all duration-300"
                asChild
              >
                <Link href="/docs">
                  <BookOpen className="mr-2 w-5 h-5" /> Documentation
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-3">
                    <stat.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce animation-delay-800">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Explore</span>
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: THE LIBRARY */}
      {/* ============================================ */}
      <section 
        ref={(el) => {
          if (el) sectionRefs.current.set('library', el);
        }}
        data-section="library"
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center py-32"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1628] to-[#030712]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/5 rounded-full blur-[150px]" />
        
        <div className="w-full max-w-[1400px] relative z-10 px-6 mx-auto">
          
          {/* Section Header */}
          <div className={`text-center mb-20 transition-all duration-1000 ${
            visibleSections.has('library') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Arduino Library</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Three Lines to Connect.
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Zero Lines for UI.
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Our ESP32 library abstracts away all the complexity of IoT connectivity. 
              Just include, initialize, and ship.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Code Examples */}
            <div className={`space-y-4 w-full transition-all duration-1000 delay-200 ${
              visibleSections.has('library') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`}>
              {/* Tabs */}
              <div className="flex gap-2 p-1.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                {codeExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === index 
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
              
              {/* Code Block */}
              <div className="relative bg-[#0d1117] rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-4 text-xs text-slate-500 font-mono">main.cpp</span>
                </div>
                
                {/* Code Content */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm font-mono leading-relaxed">
                    <code className="text-slate-300">
                      {codeExamples[activeTab].code.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="w-8 text-slate-600 select-none">{i + 1}</span>
                          <span dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/(#include|void|float|if|else|String)/g, '<span class="text-purple-400">$1</span>')
                              .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
                              .replace(/(\/\/.*$)/gm, '<span class="text-slate-500">$1</span>')
                              .replace(/(HomeWise|device|setup|loop|begin|connect|send|onCommand|readSensor|digitalWrite)/g, '<span class="text-blue-400">$1</span>')
                              .replace(/(\d+\.?\d*)/g, '<span class="text-amber-400">$1</span>')
                          }} />
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Copy Button */}
                <button className="absolute top-14 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Code2 className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Install Command */}
              <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <div className="flex-1 font-mono text-sm text-slate-400">
                  <span className="text-emerald-400">$</span> pio lib install "HomeWise"
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Copy
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className={`grid grid-cols-2 gap-4 w-full transition-all duration-1000 delay-400 ${
              visibleSections.has('library') 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10'
            }`}>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-5 h-5 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: DASHBOARD PREVIEW */}
      {/* ============================================ */}
      <section 
        ref={(el) => {
          if (el) sectionRefs.current.set('dashboard', el);
        }}
        data-section="dashboard"
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center py-32"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#030712]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        
        <div className="w-full max-w-[1400px] relative z-10 px-6 mx-auto">
          
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${
            visibleSections.has('dashboard') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Real-Time Dashboard</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Beautiful UI.
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Zero Frontend Code.
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Every sensor value you send automatically gets a widget. 
              Charts, gauges, toggles — all generated from your data.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className={`relative max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
            visibleSections.has('dashboard') 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}>
            {/* Browser Frame */}
            <div className="relative bg-[#0a0a12] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden">
              
              {/* Browser Header */}
              <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/[0.06]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm text-slate-400">app.homewise.io/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 md:p-8 grid grid-cols-12 gap-4 md:gap-6">
                
                {/* Sidebar */}
                <div className="col-span-12 md:col-span-3 space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Box className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">ESP32-Dev</div>
                        <div className="text-xs text-slate-500">Living Room</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {['temperature', 'humidity', 'light', 'motion'].map((sensor, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                          <span className="text-sm text-slate-400 capitalize">{sensor}</span>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-9 space-y-4 md:space-y-6">
                  
                  {/* Top Row - Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: 'Temperature', value: '24.5°C', icon: Gauge, color: 'blue', trend: '+2%' },
                      { label: 'Humidity', value: '65%', icon: LineChart, color: 'cyan', trend: '-5%' },
                      { label: 'Light Level', value: '850 lux', icon: Zap, color: 'amber', trend: '+12%' },
                      { label: 'Motion Events', value: '23', icon: Activity, color: 'purple', trend: '+8' }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                          <span className="text-xs text-emerald-400 font-medium">{stat.trend}</span>
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Area */}
                  <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div>
                        <div className="text-lg font-semibold text-white">Real-Time Data</div>
                        <div className="text-sm text-slate-500">Last 24 hours</div>
                      </div>
                      <div className="flex gap-2">
                        {['1H', '24H', '7D', '30D'].map((period, i) => (
                          <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${i === 1 ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-white'}`}>
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Simulated Chart */}
                    <div className="h-48 flex items-end gap-1">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const height = 30 + Math.random() * 60;
                        return (
                          <div 
                            key={i} 
                            className="flex-1 bg-gradient-to-t from-blue-500/50 to-cyan-500/50 rounded-t transition-all hover:from-blue-500 hover:to-cyan-500 animate-scale-in"
                            style={{ 
                              height: `${height}%`,
                              animationDelay: `${i * 20}ms`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {[
                      { label: 'LED Strip', status: 'On', color: '#3b82f6' },
                      { label: 'Fan Motor', status: 'Off', color: '#6b7280' },
                      { label: 'Door Lock', status: 'Locked', color: '#10b981' }
                    ].map((control, i) => (
                      <div key={i} className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white mb-1">{control.label}</div>
                          <div className="text-xs text-slate-500">{control.status}</div>
                        </div>
                        <div 
                          className="w-12 h-6 rounded-full p-1 transition-colors cursor-pointer"
                          style={{ backgroundColor: control.status !== 'Off' ? control.color + '40' : '#374151' }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full transition-transform"
                            style={{ 
                              backgroundColor: control.status !== 'Off' ? control.color : '#6b7280',
                              transform: control.status !== 'Off' ? 'translateX(24px)' : 'translateX(0)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="hidden lg:block absolute -left-12 top-1/4 w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-xl animate-float">
              <div className="w-full h-full flex items-center justify-center">
                <Wifi className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="hidden lg:block absolute -right-12 bottom-1/4 w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-2xl backdrop-blur-xl animate-float-delayed">
              <div className="w-full h-full flex items-center justify-center">
                <Radio className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: CTA */}
      {/* ============================================ */}
      <section 
        ref={(el) => {
          if (el) sectionRefs.current.set('cta', el);
        }}
        data-section="cta"
        className="relative w-full min-h-screen overflow-hidden flex items-center justify-center py-32"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a1020] to-[#030712]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[150px]" />
        
        <div className={`w-full max-w-5xl relative z-10 px-6 mx-auto text-center transition-all duration-1000 ${
          visibleSections.has('cta') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 mb-8 animate-float mx-auto">
            <Cpu className="w-10 h-10 text-blue-400" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400">
              Ready to Build
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              the Future of IoT?
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of developers who ship IoT products faster with HomeWise. 
            Free tier includes unlimited devices and 30-day data retention.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-200">
            <Button 
              size="lg" 
              className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-white rounded-full transition-all duration-300 shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.6)] hover:scale-[1.02]"
              asChild
            >
              <Link href="/signup">
                Create Free Account <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 px-12 text-lg font-semibold border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-white rounded-full transition-all duration-300"
              asChild
            >
              <Link href="https://github.com/homewise">
                <Github className="mr-3 w-6 h-6" /> View on GitHub
              </Link>
            </Button>
          </div>

          {/* Trust Elements */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Unlimited devices on free tier</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Open-source library</span>
            </div>
          </div>

          {/* Logos Section */}
          <div className="mt-20 pt-12 border-t border-white/[0.05] animate-fade-in-up animation-delay-400">
            <p className="text-sm text-slate-600 mb-8 uppercase tracking-widest">Trusted by developers at</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
              {['Google', 'Microsoft', 'Amazon', 'Tesla', 'SpaceX'].map((company, i) => (
                <div 
                  key={i} 
                  className="text-xl font-bold text-slate-400 animate-fade-in-up"
                  style={{ animationDelay: `${500 + i * 100}ms` }}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        .animate-float-delayed { 
          animation: float-delayed 8s ease-in-out infinite 1s; 
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scaleY(0);
          }
          to {
            opacity: 1;
            transform: scaleY(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          opacity: 0;
          transform-origin: bottom;
        }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        
        /* Dynamic color classes */
        .bg-blue-500\/10 { background-color: rgba(59, 130, 246, 0.1); }
        .bg-purple-500\/10 { background-color: rgba(139, 92, 246, 0.1); }
        .bg-cyan-500\/10 { background-color: rgba(6, 182, 212, 0.1); }
        .bg-emerald-500\/10 { background-color: rgba(16, 185, 129, 0.1); }
        .bg-amber-500\/10 { background-color: rgba(245, 158, 11, 0.1); }
        .bg-pink-500\/10 { background-color: rgba(236, 72, 153, 0.1); }
        
        .text-blue-400 { color: #60a5fa; }
        .text-purple-400 { color: #a78bfa; }
        .text-cyan-400 { color: #22d3ee; }
        .text-emerald-400 { color: #34d399; }
        .text-amber-400 { color: #fbbf24; }
        .text-pink-400 { color: #f472b6; }
      `}</style>
    </div>
  );
}