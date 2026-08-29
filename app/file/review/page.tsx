'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, AlertTriangle, Edit3, Check } from 'lucide-react';
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
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const priorityColors: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/file" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-xl font-bold text-gray-900">Review Your Complaint</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Step 2/3</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {/* Classification card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">AI Classification</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Department</span>
              <span className="text-xs font-medium text-gray-800 bg-blue-50 px-2 py-1 rounded-lg">{draft.department}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Category</span>
              <span className="text-xs font-medium text-gray-700">{draft.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Sub-category</span>
              <span className="text-xs font-medium text-gray-700">{draft.sub_category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Priority</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${priorityColors[draft.priority] || 'bg-gray-100 text-gray-600'}`}>
                {draft.priority === 'High' ? '🔴' : draft.priority === 'Medium' ? '🟡' : '🟢'} {draft.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Original text */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Words</p>
          <p className="text-sm text-gray-700 italic">&ldquo;{draft.raw_text}&rdquo;</p>
        </div>

        {/* Structured draft */}
        <div className="bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Formal Version</p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
            >
              {isEditing ? <Check className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={editedDraft}
              onChange={(e) => setEditedDraft(e.target.value)}
              className="w-full h-48 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{editedDraft}</p>
          )}
        </div>

        {/* Extracted fields */}
        {draft.extracted_fields && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Extracted Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">What</p>
                <p className="text-xs text-gray-700">{draft.extracted_fields.what}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Where</p>
                <p className="text-xs text-gray-700">{draft.extracted_fields.where}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">When</p>
                <p className="text-xs text-gray-700">{draft.extracted_fields.when}</p>
              </div>
              {draft.extracted_fields.references?.length > 0 && (
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">References</p>
                  <p className="text-xs text-gray-700">{draft.extracted_fields.references.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Complaint →'}
        </button>
      </div>
    </div>
  );
}
