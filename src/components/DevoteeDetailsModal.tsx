import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Minus, Plus, Sparkles, Truck, User, X } from 'lucide-react';
import {
  formatINR,
  getTomorrowDateISO,
  MALAYALAM_NAKSHATRAS,
} from '../data/temples';
import type { Pooja, PrasadamDeliveryMode, Temple } from '../types';

interface DevoteeDetailsModalProps {
  isOpen: boolean;
  temple: Temple | null;
  pooja: Pooja | null;
  currentPrasadamMode: PrasadamDeliveryMode;
  onClose: () => void;
  onConfirm: (payload: {
    temple: Temple;
    pooja: Pooja;
    devoteeName: string;
    nakshatra: string;
    poojaDate: string;
    quantity: number;
    prasadamMode: PrasadamDeliveryMode;
  }) => void;
}

export function DevoteeDetailsModal({
  isOpen,
  temple,
  pooja,
  currentPrasadamMode,
  onClose,
  onConfirm,
}: DevoteeDetailsModalProps) {
  const [devoteeName, setDevoteeName] = useState('');
  const [nakshatra, setNakshatra] = useState<string>(MALAYALAM_NAKSHATRAS[0]);
  const [poojaDate, setPoojaDate] = useState<string>(getTomorrowDateISO());
  const [quantity, setQuantity] = useState<number>(1);
  const [prasadamMode, setPrasadamMode] =
    useState<PrasadamDeliveryMode>(currentPrasadamMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDevoteeName('');
      setNakshatra(MALAYALAM_NAKSHATRAS[0]);
      setPoojaDate(getTomorrowDateISO());
      setQuantity(1);
      setPrasadamMode(currentPrasadamMode);
      setError(null);
    }
  }, [isOpen, pooja?.id, currentPrasadamMode]);

  if (!isOpen || !temple || !pooja) return null;

  const todayISO = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName.trim()) {
      setError('Please enter the devotee’s name for Sankalpam.');
      return;
    }
    if (!poojaDate) {
      setError('Please select a valid pooja date.');
      return;
    }
    onConfirm({
      temple,
      pooja,
      devoteeName: devoteeName.trim(),
      nakshatra,
      poojaDate,
      quantity,
      prasadamMode,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="devotee-modal-title"
    >
      <div className="bg-white border border-[#E8E0D5] rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#F0EAE0] shrink-0">
          <div>
            <p className="text-xs font-medium text-[#7A1C1C]">
              {temple.name} · {pooja.slot}
            </p>
            <h2
              id="devotee-modal-title"
              className="font-display text-xl sm:text-2xl font-semibold text-[#1F1815] mt-0.5"
            >
              {pooja.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close devotee details modal"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#6B5E57] hover:bg-[#FAF7F2] hover:text-[#1F1815] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#7A1C1C]"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="devotee-name-input"
              className="block text-xs font-semibold text-[#1F1815] mb-1.5"
            >
              Devotee Name (for Sankalpam)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="devotee-name-input"
                type="text"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                maxLength={120}
                placeholder="e.g. Meenakshi Nair"
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#DED4C6] text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nakshatra-select"
                className="block text-xs font-semibold text-[#1F1815] mb-1.5"
              >
                Nakshatra / Birth Star
              </label>
              <div className="relative">
                <Sparkles className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="nakshatra-select"
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded-xl border border-[#DED4C6] bg-white text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                >
                  {MALAYALAM_NAKSHATRAS.map((star) => (
                    <option key={star} value={star}>
                      {star}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="pooja-date-input"
                className="block text-xs font-semibold text-[#1F1815] mb-1.5"
              >
                Pooja Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="pooja-date-input"
                  type="date"
                  value={poojaDate}
                  min={todayISO}
                  onChange={(e) => setPoojaDate(e.target.value)}
                  className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded-xl border border-[#DED4C6] text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#1F1815] mb-1.5">
              Prasadam Option
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPrasadamMode('Counter Pickup')}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  prasadamMode === 'Counter Pickup'
                    ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C]'
                    : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Collect at Temple Counter</div>
                  <div className="text-[11px] opacity-75">No extra fee</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPrasadamMode('Speed Post')}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  prasadamMode === 'Speed Post'
                    ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C]'
                    : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Speed Post Delivery</div>
                  <div className="text-[11px] opacity-75">+₹50 postal charge</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-[#FAF3E6] border border-[#E5D3B3] rounded-xl px-3.5 py-2.5 text-[11px] text-[#6B5E57]">
            <strong className="text-[#7A1C1C]">Cancellation Slot:</strong> You can cancel this Vazhipadu anytime up to the previous day of the pooja date (11:59 PM IST).
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0]">
            <div>
              <span className="text-xs text-[#6B5E57] block">Quantity</span>
              <span className="text-sm font-semibold text-[#1F1815] tabular-nums">
                {formatINR(pooja.price)} × {quantity} = {formatINR(pooja.price * quantity)}
              </span>
            </div>

            <div className="inline-flex items-center border border-[#DED4C6] rounded-xl overflow-hidden bg-[#FAF7F2]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#1F1815] hover:bg-[#EFE7DB] transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#1F1815] hover:bg-[#EFE7DB] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Add Vazhipadu to Cart · {formatINR(pooja.price * quantity)}
          </button>
        </form>
      </div>
    </div>
  );
}
