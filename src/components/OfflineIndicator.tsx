import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="no-print fixed bottom-20 md:bottom-5 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#7A1C1C] border border-[#D97706]/60 px-3.5 py-2 text-xs font-medium text-white shadow-lg"
      role="status"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      <span>Offline Mode — Cached temple details available</span>
    </div>
  );
}
