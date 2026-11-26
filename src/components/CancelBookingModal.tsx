import React, { useEffect, useState } from 'react';
import { AlertTriangle, CalendarX2, X } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { formatINR, getCancellationEligibility } from '../data/temples';
import type { BookingRecord } from '../types';

interface CancelBookingModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onCancelled: () => void;
}

const PRESET_REASONS = [
  'Change in travel or temple visit plans',
  'Rescheduling to another Nakshatra date',
  'Incorrect devotee name or birth star entered',
  'Family unavoidable circumstances',
] as const;

export function CancelBookingModal({
  booking,
  onClose,
  onCancelled,
}: CancelBookingModalProps) {
  const { cancelBooking, isAdmin } = useFirebase();
  const [selectedReason, setSelectedReason] = useState<string>(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setSelectedReason(PRESET_REASONS[0]);
      setCustomReason('');
      setError(null);
    }
  }, [booking?.bookingId]);

  if (!booking) return null;

  const eligibility = getCancellationEligibility(booking, isAdmin);
  const effectiveReason =
    selectedReason === 'Other' ? customReason.trim() : selectedReason;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!effectiveReason) {
      setError('Please provide a reason for cancelling this Vazhipadu.');
      return;
    }

    setSubmitting(true);
    try {
      await cancelBooking(booking, effectiveReason);
      onCancelled();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to cancel booking. Please verify cancellation deadline.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#EFE4D2]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#7A1C1C] flex items-center justify-center shrink-0">
              <CalendarX2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="cancel-modal-title"
                className="font-display text-xl font-semibold text-[#1F1815]"
              >
                Cancel Vazhipadu Booking
              </h2>
              <p className="text-xs text-[#6B5E57] mt-0.5">
                <span className="font-mono font-semibold text-[#7A1C1C]">
                  {booking.bookingId}
                </span>{' '}
                · {booking.templeName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cancellation modal"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#6B5E57] hover:bg-[#FAF7F2] hover:text-[#1F1815] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {error && (
            <div
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#7A1C1C]"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Policy & Refund Summary */}
          <div className="bg-[#FAF3E6] border border-[#E5D3B3] rounded-xl p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-[#1F1815]">
              <span>Pooja Date: {eligibility.earliestDateLabel}</span>
              <span className="font-mono text-[#7A1C1C]">
                {formatINR(booking.totalAmount)}
              </span>
            </div>
            <p className="text-[#6B5E57] leading-relaxed">
              {eligibility.reason}
            </p>
            {isAdmin && eligibility.isPastDeadline && (
              <div className="pt-1 flex items-center gap-1.5 text-amber-800 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Admin override active for past-cutoff cancellation.</span>
              </div>
            )}
          </div>

          <div>
            <span className="block text-xs font-semibold text-[#1F1815] mb-2">
              Reason for Cancellation
            </span>
            <div className="space-y-2">
              {[...PRESET_REASONS, 'Other'].map((reasonOption) => {
                const active = selectedReason === reasonOption;
                return (
                  <label
                    key={reasonOption}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      active
                        ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C] font-semibold'
                        : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      checked={active}
                      onChange={() => setSelectedReason(reasonOption)}
                      className="accent-[#7A1C1C]"
                    />
                    <span>{reasonOption}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div>
              <label
                htmlFor="custom-cancel-reason"
                className="block text-xs font-medium text-[#1F1815] mb-1"
              >
                Specify Reason
              </label>
              <textarea
                id="custom-cancel-reason"
                rows={2}
                maxLength={240}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter cancellation details..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#DED4C6] text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                required
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-4 py-2 rounded-xl border border-[#DED4C6] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#1F1815] cursor-pointer"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              disabled={submitting || !eligibility.eligible}
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
