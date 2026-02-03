
import { format } from 'date-fns';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  PlusCircle,
  Trash2,
  Key,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
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

import { useToast } from '@/hooks/use-toast';
import { AnimatedLogo } from '../layout/animated-logo';
import { useAuth } from '@/application/hooks/use-auth';
import { useApiKeys } from '@/application/hooks/use-api-keys';
// ApiKey is already imported from domain/models/api-key via useApiKeys return type inference or explicit import if needed.
// But wait, useApiKeys return type is inferred.
// Let's import it correctly.
import { ApiKey } from '@/domain/models/api-key';
import { isValid } from 'date-fns';

const formatSafeDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return 'Date not available';
  const date = new Date(dateStr);
  return isValid(date) ? format(date, "PPP 'at' p") : 'Invalid date';
};

export function ConnectHive() {
  const { user } = useAuth();
  const [isGenerating, startTransition] = useTransition();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const { apiKeys: keys, loading: apiKeysLoading, createApiKey, deleteApiKey } = useApiKeys();

  const handleGenerateKey = () => {
    if (!user || !user.name) return;
    startTransition(async () => {
      // Assuming a default naming convention or allowing user to name it logic could be added
      const tokenName = `${user.name}'s Key ${Math.floor(Math.random() * 1000)}`;
      await createApiKey(tokenName);
      toast({
        title: '✨ API Key Generated',
        description: 'Your new API key is ready to use.'
      });
    });
  };

  const handleDeleteKey = (id: string) => {
    if (!user) return;
    startTransition(async () => {
      await deleteApiKey(id);
      toast({
        title: 'API Key Deleted',
        description: 'The API key has been removed successfully.'
      });
    });
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard.'
    });
  };

  return (
    <section className="w-full space-y-8 animate-fade-in-up">
      {/* API Keys Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/[0.05]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Key className="w-6 h-6 text-blue-400" />
                <span>API Tokens</span>
              </h2>
              <p className="text-sm text-slate-400">
                Manage your API keys for device authentication
              </p>
            </div>

            <Button
              onClick={handleGenerateKey}
              disabled={isGenerating || apiKeysLoading}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Generate New Token
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {apiKeysLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <AnimatedLogo />
              <p className="text-slate-400 text-sm">Loading your API tokens...</p>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-white/[0.05]">
                <Key className="w-10 h-10 text-slate-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">No API Tokens Yet</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Generate your first API token to start connecting your ESP32 devices to the platform.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key, index) => (
                <div
                  key={key.id}
                  className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  {/* Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Key className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-white">{key.name}</h3>
                            <p className="text-xs text-slate-500">
                              Created {formatSafeDate(key.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* API Key Display */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-3 rounded-xl bg-black/20 border border-white/[0.05] font-mono text-sm text-slate-300 overflow-x-auto scrollbar-thin">
                            {key.key}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyKey(key.key, key.id)}
                            className="h-10 w-10 rounded-xl hover:bg-white/[0.05] transition-colors"
                          >
                            {copiedKey === key.id ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group/delete"
                            >
                              <Trash2 className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#0a0a12] border border-white/[0.1] backdrop-blur-xl">
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                  <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <AlertDialogTitle className="text-xl text-white">Delete API Key?</AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-slate-400 leading-relaxed">
                                This action cannot be undone. This will permanently delete the API key <strong className="text-white">{key.name}</strong> and may cause integrations to stop working.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl border-white/[0.1] hover:bg-white/[0.05]">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteKey(key.id)}
                                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl"
                              >
                                Delete Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Styles */}
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Custom scrollbar for API key display */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
