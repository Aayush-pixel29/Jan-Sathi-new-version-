'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, Search, Check } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('jan-sathi-result');
    if (!stored) {
      router.push('/file');
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) return null;

  const trackingId = result.grievance?.tracking_id || 'JS-ERROR';

  const copyId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 flex flex-col">
      <div className="flex-1 px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your complaint is submitted</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          We have forwarded your grievance to the relevant department.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm shadow-sm mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-2">Tracking ID</p>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
            <span className="text-lg font-mono font-bold text-gray-900">{trackingId}</span>
            <button
              onClick={copyId}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4 mb-10">
          <h2 className="text-sm font-bold text-gray-800">What happens next?</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-700">Complaint registered successfully</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-700">Sent to the relevant department</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
              <span className="text-sm text-gray-700">Department review</span>
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
              <span className="text-sm text-gray-700">Resolution</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push(`/track/${trackingId}`)}
          className="w-full max-w-sm py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Track This Complaint · स्थिति जाँचें
        </button>
      </div>
    </div>
  );
}
