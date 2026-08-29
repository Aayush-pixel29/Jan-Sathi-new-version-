'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, AlertTriangle, Edit3, Check, Info } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('jan-sathi-draft');
    if (!stored) {
      router.push('/file');
      return;
    }
    const parsed = JSON.parse(stored);
    setDraft(parsed);
    setEditedDraft(parsed.structured_draft);
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_text: draft.raw_text,
          structured_text: editedDraft,
          department: draft.department,
          category: draft.category,
          sub_category: draft.sub_category,
          priority: draft.priority,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      const result = await res.json();
      sessionStorage.setItem('jan-sathi-result', JSON.stringify(result));
      sessionStorage.removeItem('jan-sathi-draft');
      router.push('/file/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (!draft) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500 font-medium">Loading...</div>
      </div>
    );
  }

  const priorityColors: Record<string, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-amber-100 text-amber-800',
    Low: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/file" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-xl font-bold text-gray-900">Review Your Complaint</h1>
          <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full font-medium">Step 2/3</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        
        {/* Trust Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 font-medium">
            You stay in control. Review the details below before anything is submitted.
          </p>
        </div>

        {/* Classification card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">Department Routing</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Department</span>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{draft.department}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-600">Category</span>
              <span className="text-xs font-semibold text-gray-800">{draft.category}</span>
            </div>
          </div>
        </div>

        {/* Extracted fields (Moved up for better comprehension) */}
        {draft.extracted_fields && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">What we understood</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">What</p>
                <p className="text-sm font-medium text-gray-900">{draft.extracted_fields.what}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Where</p>
                <p className="text-sm font-medium text-gray-900">{draft.extracted_fields.where}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">When</p>
                <p className="text-sm font-medium text-gray-900">{draft.extracted_fields.when}</p>
              </div>
              {draft.extracted_fields.references?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">References</p>
                  <p className="text-sm font-medium text-gray-900">{draft.extracted_fields.references.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Original text */}
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Your Words</p>
          <p className="text-sm text-gray-800 italic">&ldquo;{draft.raw_text}&rdquo;</p>
        </div>

        {/* Structured draft (Moved down, visually distinct) */}
        <div className="bg-white rounded-2xl border-2 border-blue-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Formal Legal Version</p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={editedDraft}
              onChange={(e) => setEditedDraft(e.target.value)}
              className="w-full h-48 p-3 bg-white border-2 border-blue-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-serif">{editedDraft}</p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-xl font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Complaint · शिकायत दर्ज करें →'}
        </button>
      </div>
    </div>
  );
}
