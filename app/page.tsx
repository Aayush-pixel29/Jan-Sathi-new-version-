'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine, Search, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('jan-sathi-auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.loggedIn) {
          setIsAuth(true);
        }
      } catch {
        // ignore
      }
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!checkingAuth && !isAuth) {
      router.push('/login');
    }
  }, [checkingAuth, isAuth, router]);

  if (checkingAuth || !isAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jan Sathi</h1>
            <p className="text-xs text-gray-600">AI Grievance Companion</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-medium text-blue-100">Powered by AI</span>
          </div>
          <h2 className="text-lg font-bold mb-1">
            Government complaint?
          </h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Tell us what happened. We&apos;ll help you get it resolved.
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-4 space-y-3 flex-1">
        {/* File complaint */}
        <button
          onClick={() => router.push('/file')}
          className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">File a Complaint · शिकायत दर्ज करें</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Describe your issue in Hindi, English, or Hinglish. AI will classify and draft a formal grievance for you.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
          </div>
        </button>

        {/* Track complaint */}
        <button
          onClick={() => router.push('/track')}
          className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98] group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Track a Complaint · स्थिति जाँचें</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Check your complaint status in plain language. Get alerts if your grievance is stalled.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0 mt-1" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 text-center">
        <p className="text-xs text-gray-500">
          Not affiliated with or endorsed by any government body
        </p>
      </div>
    </div>
  );
}
