'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OtpPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-white">
      <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
      <p className="mb-4 text-slate-400">OTP Login is not currently supported in this version.</p>
      <Button asChild>
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  );
}
