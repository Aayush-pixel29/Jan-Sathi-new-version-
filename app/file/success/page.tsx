'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Search, PenLine } from 'lucide-react';
import CopyButton from '@/components/copy-button';

export default function SuccessPage() {
  const router = useRouter();
  const [result, setResult] = useState<{ tracking_id: string; status: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('jan-sathi-result');
    if (!stored) {
      router.push('/file');
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complaint Filed!</h1>
        <p className="text-sm text-gray-500 mb-6">Your grievance has been registered successfully.</p>

        {/* Tracking ID */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <p className="text-xs text-gray-500 mb-2">Your Tracking ID</p>
          <p className="text-2xl font-mono font-bold text-blue-700 tracking-wider mb-3">
            {result.tracking_id}
          </p>
          <CopyButton text={result.tracking_id} label="Copy Tracking ID" className="w-full justify-center" />
        </div>

        <p className="text-xs text-gray-400 mb-6">Save this ID to check your status anytime.</p>

        {/* Action buttons */}
        <div className="space-y-3">
          <Link
            href={`/track/${result.tracking_id}`}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Track This Complaint
          </Link>
          <Link
            href="/file"
            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            File Another Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}
