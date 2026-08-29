'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

const DEMO_IDS = ['JS-20260829-DEMO', 'JS-20260829-PEN1'];

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleTrack = () => {
    const id = trackingId.trim().toUpperCase();
    if (!id) {
      setError('Please enter a tracking ID');
      return;
    }
    setError('');
    router.push(`/track/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Track Your Complaint</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4">
        <p className="text-sm text-gray-500 mb-4">Enter your tracking ID to check the current status.</p>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="JS-20260829-XXXX"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg mt-2">{error}</p>
        )}

        <button
          onClick={handleTrack}
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Check Status
        </button>

        {/* Demo IDs */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-700 mb-2">📋 Demo Tracking IDs</p>
          <div className="space-y-2">
            {DEMO_IDS.map((id) => (
              <button
                key={id}
                onClick={() => { setTrackingId(id); router.push(`/track/${id}`); }}
                className="block w-full text-left text-xs font-mono text-blue-600 bg-white hover:bg-blue-50 p-2.5 rounded-lg transition-colors border border-amber-100"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
