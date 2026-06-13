'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Step = 'loading' | 'set-password' | 'done' | 'error';
type FlowType = 'invite' | 'recovery';

export default function InviteAuthPage() {
  const [step, setStep] = useState<Step>('loading');
  const [flowType, setFlowType] = useState<FlowType>('invite');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Supabase puts tokens in the URL hash after redirect
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = (params.get('type') || 'invite') as FlowType;
    const errorDesc = params.get('error_description');

    if (errorDesc) {
      setError(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
      setStep('error');
      return;
    }

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired invite link. Please ask your landlord to resend the invitation.');
      setStep('error');
      return;
    }

    setFlowType(type);

    // Exchange tokens for a session
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message);
          setStep('error');
        } else {
          setStep('set-password');
        }
      });
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      await supabase.auth.signOut();
      setStep('done');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-blue-600 mb-1">Aaralink</div>
          {step !== 'done' && step !== 'error' && (
            <p className="text-sm text-gray-500">
              {flowType === 'recovery' ? 'Reset your password' : "You've been invited to a property"}
            </p>
          )}
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500">Verifying your invite link…</p>
          </div>
        )}

        {/* Set Password */}
        {step === 'set-password' && (
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {flowType === 'recovery' ? 'Reset your password' : 'Set your password'}
              </h2>
              <p className="text-sm text-gray-500">
                {flowType === 'recovery'
                  ? 'Enter a new password for your Aaralink account.'
                  : 'Create a password to access your account in the Aaralink app.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Set Password & Continue'}
            </button>
          </form>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {flowType === 'recovery' ? 'Password updated!' : "You're all set!"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {flowType === 'recovery'
                  ? 'Your password has been updated. Open the Aaralink app and sign in.'
                  : 'Your password has been created. Download the Aaralink app to access your account.'}
              </p>
            </div>
            {flowType === 'invite' && (
              <div className="space-y-2 pt-2">
                <a
                  href="https://apps.apple.com/app/aaralink"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download on the App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/aaralink"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.28-2.72-2.72-10.87 9.8zM.25 1.12C.09 1.43 0 1.79 0 2.21v19.57c0 .42.09.79.26 1.1l.06.06 10.96-10.96v-.26L.31 1.06l-.06.06zM20.44 10.37l-2.93-1.69-3.05 3.05 3.05 3.05 2.94-1.7c.84-.48.84-1.27-.01-1.71zM3.18.24l12.6 7.27-2.72 2.72L3.18.24z"/>
                  </svg>
                  Get it on Google Play
                </a>
                <p className="text-xs text-gray-400">Already have the app? Open it and sign in with your email.</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Link expired or invalid</h2>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
            <p className="text-xs text-gray-400">Ask your landlord to resend the invitation.</p>
          </div>
        )}

      </div>
    </div>
  );
}
