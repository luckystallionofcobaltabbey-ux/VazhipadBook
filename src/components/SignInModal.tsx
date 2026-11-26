import { useState } from 'react';
import { Flame, ShieldCheck, X } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';

interface SignInModalProps {
  isOpen: boolean;
  reason?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function SignInModal({
  isOpen,
  reason,
  onClose,
  onSuccess,
}: SignInModalProps) {
  const { signInWithGoogle, isConfigured } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/popup-closed-by-user')) {
        setError('Google sign-in popup was closed before completion. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#EFE4D2]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A1C1C]/10 text-[#7A1C1C] flex items-center justify-center shrink-0 mt-0.5">
              <Flame className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <h2
                id="signin-modal-title"
                className="font-display text-2xl font-semibold text-[#1F1815]"
              >
                Sign in to VazhipaduBook
              </h2>
              <p className="text-xs text-[#6B5E57] mt-1 leading-relaxed">
                {reason ||
                  'Use your Google account to confirm Vazhipadu offerings and access cloud-synced E-Vazhipadu receipts.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in dialog"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#6B5E57] hover:bg-[#FAF7F2] hover:text-[#1F1815] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!isConfigured && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              Firebase credentials are currently placeholders. Update{' '}
              <code className="font-mono">firebase-applet-config.json</code> or{' '}
              <code className="font-mono">src/firebaseConfig.ts</code> to enable sign-in.
            </div>
          )}

          {error && (
            <div
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#7A1C1C] leading-relaxed"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={loading || !isConfigured}
            onClick={handleGoogleSignIn}
            className="w-full min-h-[48px] px-5 py-3 rounded-xl border border-[#D8C5A3] bg-white hover:bg-[#FAF3E6] text-[#1F1815] text-sm font-semibold flex items-center justify-center gap-3 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>{loading ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-start gap-2.5 text-xs text-[#6B5E57] bg-[#FAF3E6] border border-[#EFE1C6] rounded-xl p-3.5">
            <ShieldCheck className="w-4 h-4 text-[#7A1C1C] shrink-0 mt-0.5" />
            <span>
              One-click Google Sign-In keeps your Sankalpam records and E-Vazhipadu tickets securely synced across all your devices.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
