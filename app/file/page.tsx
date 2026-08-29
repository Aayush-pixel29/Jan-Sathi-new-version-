'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Lightbulb } from 'lucide-react';
import Link from 'next/link';

const EXAMPLES = [
  'My father\'s pension hasn\'t come for 3 months. We went to the post office in Lucknow but they said file online.',
  'Ration card application rejected without any reason. All documents were submitted properly.',
  'Street lights in our colony haven\'t been working for 2 months. Complained to municipal office but no action.',
  'Birth certificate not issued despite applying 6 months ago at the tehsil office in Jaipur.',
];

export default function FilePage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiStep, setAiStep] = useState(0);

  const handleSubmit = async () => {
    if (text.trim().length < 20) {
      setError('Please describe your problem in at least 20 characters.');
      return;
    }
    setError('');
    setLoading(true);
    setAiStep(1);

    try {
      const stepTimer1 = setTimeout(() => setAiStep(2), 1500);
      const stepTimer2 = setTimeout(() => setAiStep(3), 3000);

      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Classification failed');
      }

      const classification = await res.json();
      sessionStorage.setItem('jan-sathi-draft', JSON.stringify({
        raw_text: text.trim(),
        ...classification,
      }));

      router.push('/file/review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
      setAiStep(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Jan Sathi is working...</h2>
            <div className="space-y-3 text-left">
              {[
                'Reading your complaint',
                'Identifying the right department',
                'Drafting formal grievance',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    aiStep > i + 1 ? 'bg-emerald-500 text-white' :
                    aiStep === i + 1 ? 'bg-blue-500 text-white animate-pulse' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {aiStep > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-sm ${
                    aiStep > i + 1 ? 'text-emerald-700' :
                    aiStep === i + 1 ? 'text-blue-700 font-medium' :
                    'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">This takes a few seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-xl font-bold text-gray-900">Describe Your Problem</h1>
          <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full font-medium">Step 1/3</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4">
        <p className="text-sm text-gray-600 mb-4">
          Tell us what happened in your own words. Hindi, English, Hinglish — all fine.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. My father's pension hasn't come for 3 months, we went to the post office in Lucknow but they said file online..."
          className="w-full h-40 p-4 bg-white border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
          maxLength={2000}
        />
        <p className={`text-xs mt-1 text-right ${text.length > 1900 ? 'text-amber-600' : 'text-gray-500'}`}>
          {text.length} / 2000
        </p>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg mt-2 font-medium">{error}</p>
        )}

        {/* Examples */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-gray-600">Try an example:</span>
          </div>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="block w-full text-left text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 p-3 rounded-xl transition-colors font-medium"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={text.trim().length < 20}
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Let AI Draft Your Complaint · AI द्वारा ड्राफ्ट करें
        </button>
      </div>
    </div>
  );
}
