'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, RefreshCw, FastForward } from 'lucide-react';
import StatusTimeline from '@/components/status-timeline';
import CopyButton from '@/components/copy-button';

interface StatusData {
  grievance: any;
  translations: Record<string, any>;
  is_stalled: boolean;
}

export default function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [escalation, setEscalation] = useState<{ escalation_letter: string; addressed_to: string } | null>(null);
  const [escalating, setEscalating] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/status/${id}`);
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to fetch status');
      }
      const result = await res.json();
      setData(result);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Demo auto-advance
  useEffect(() => {
    if (!isDemo || !data) return;
    if (data.grievance.status === 'Closed') return;
    const interval = setInterval(async () => {
      await fetch('/api/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: id }),
      });
      fetchStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [isDemo, data, id, fetchStatus]);

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      const res = await fetch('/api/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: id }),
      });
      if (!res.ok) throw new Error('Failed to generate escalation');
      const result = await res.json();
      setEscalation(result);
    } catch {
      setError('Failed to generate escalation letter');
    } finally {
      setEscalating(false);
    }
  };

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      await fetch('/api/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_id: id }),
      });
      await fetchStatus();
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Fetching status...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-gray-700 font-medium mb-2">Complaint Not Found</p>
        <p className="text-sm text-gray-500 text-center mb-4">{error}</p>
        <Link href="/track" className="text-sm text-blue-600 hover:text-blue-800">
          ← Try a different ID
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/track" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">Complaint Status</h1>
        <p className="text-xs font-mono text-blue-600 mt-1">{id}</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-gray-500">Department</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
              {data.grievance.department}
            </span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-3">
            &ldquo;{data.grievance.raw_text}&rdquo;
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Status Timeline</h2>
          <StatusTimeline
            statusHistory={data.grievance.status_history}
            currentStatus={data.grievance.status}
            translations={data.translations}
          />
        </div>

        {/* SLA Alert */}
        {data.is_stalled && !escalation && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">SLA Alert</span>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              This complaint has been under review longer than expected. You can send a formal reminder.
            </p>
            <button
              onClick={handleEscalate}
              disabled={escalating}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {escalating ? 'Generating Reminder...' : '📨 Send a Reminder'}
            </button>
          </div>
        )}

        {/* Escalation Letter */}
        {escalation && (
          <div className="bg-white rounded-2xl border border-blue-100 p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              📨 Reminder Draft
            </p>
            <p className="text-xs text-gray-500 mb-3">To: {escalation.addressed_to}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed mb-3">
              {escalation.escalation_letter}
            </div>
            <CopyButton text={escalation.escalation_letter} label="Copy Letter" className="w-full justify-center" />
          </div>
        )}

        {/* Demo advance button */}
        <button
          onClick={handleAdvance}
          disabled={advancing || data.grievance.status === 'Closed'}
          className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium text-xs hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
        >
          <FastForward className="w-3.5 h-3.5" />
          {advancing ? 'Advancing...' : 'Demo: Advance Status'}
        </button>
      </div>
    </div>
  );
}
