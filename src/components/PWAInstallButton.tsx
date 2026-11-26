import { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'mobile';
}

export function PWAInstallButton({ variant = 'header' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        title={isIOS ? 'Add VazhipaduBook to Home Screen' : 'Install VazhipaduBook App'}
        className={
          variant === 'mobile'
            ? 'flex items-center justify-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl border border-[#D97706]/45 bg-[#FAF3E6] hover:bg-[#F2E7D3] text-[#7A1C1C] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors'
            : 'min-h-[38px] md:min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl border border-[#D97706]/50 bg-[#FAF3E6] hover:bg-[#F2E7D3] text-[#7A1C1C] text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors'
        }
      >
        <Download className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
        <span className="sm:hidden">Install</span>
        <span className="hidden sm:inline">{isIOS ? 'Add App' : 'Install App'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
        >
          <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
            <div className="flex items-start justify-between px-6 pt-5 pb-3 border-b border-[#EFE4D2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#7A1C1C]/10 text-[#7A1C1C] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="pwa-install-guide-title"
                    className="font-display text-lg font-semibold text-[#1F1815]"
                  >
                    Install VazhipaduBook
                  </h2>
                  <p className="text-[11px] text-[#6B5E57]">
                    Add to your phone home screen
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install guide"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#6B5E57] hover:bg-[#FAF7F2] hover:text-[#1F1815] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-[#5C4E45] leading-relaxed">
              {isIOS ? (
                <ol className="space-y-2.5 list-decimal list-inside">
                  <li>
                    Open this URL in <strong className="text-[#1F1815]">Safari</strong> on your iPhone or iPad.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>1.</span>
                    <span>
                      Tap the <Share className="w-3.5 h-3.5 inline text-[#7A1C1C] mx-0.5" />{' '}
                      <strong className="text-[#1F1815]">Share</strong> button in Safari&apos;s toolbar.
                    </span>
                  </li>
                  <li>
                    Scroll down and tap{' '}
                    <strong className="text-[#1F1815]">Add to Home Screen</strong>, then tap{' '}
                    <strong className="text-[#1F1815]">Add</strong>.
                  </li>
                </ol>
              ) : (
                <div className="space-y-2.5">
                  <p>
                    To download VazhipaduBook directly onto your phone or computer:
                  </p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>
                      Open the app URL directly in <strong className="text-[#1F1815]">Chrome</strong> or{' '}
                      <strong className="text-[#1F1815]">Edge</strong> (not inside a preview frame).
                    </li>
                    <li>
                      Tap the browser menu (<strong className="text-[#1F1815]">⋮</strong>) and choose{' '}
                      <strong className="text-[#1F1815]">Install app</strong> or{' '}
                      <strong className="text-[#1F1815]">Add to Home screen</strong>.
                    </li>
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="w-full min-h-[42px] rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
