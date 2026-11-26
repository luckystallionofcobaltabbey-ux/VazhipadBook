import { useState } from 'react';
import { Ban, Calendar, Clock, QrCode, Ticket } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import {
  formatINR,
  formatPoojaDateDisplay,
  getCancellationEligibility,
} from '../data/temples';
import type { BookingRecord } from '../types';

interface MyBookingsViewProps {
  onSelectReceipt: (booking: BookingRecord) => void;
  onCancelBooking: (booking: BookingRecord) => void;
  onExploreTemples: () => void;
  onOpenSignIn: () => void;
}

export function MyBookingsView({
  onSelectReceipt,
  onCancelBooking,
  onExploreTemples,
  onOpenSignIn,
}: MyBookingsViewProps) {
  const { currentUser, bookings, bookingsLoading, bookingsError } =
    useFirebase();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'CANCELLED'>('ACTIVE');

  if (!currentUser) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-8 sm:p-10 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#7A1C1C]/10 text-[#7A1C1C] flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1815] mb-2">
            Sign in to view your E-Vazhipadu Tickets
          </h1>
          <p className="text-sm text-[#6B5E57] max-w-md mx-auto mb-6">
            Your temple bookings and digital receipts are securely synced to your Google account across devices.
          </p>
          <button
            type="button"
            onClick={onOpenSignIn}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Continue with Google
          </button>
        </div>
      </section>
    );
  }

  const activeBookings = bookings.filter(
    (b) => (b.bookingStatus || 'CONFIRMED') !== 'CANCELLED'
  );
  const cancelledBookings = bookings.filter(
    (b) => b.bookingStatus === 'CANCELLED'
  );
  const visibleBookings =
    activeTab === 'ACTIVE' ? activeBookings : cancelledBookings;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 md:pb-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5D3B3]">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#1F1815]">
            My Vazhipadu Bookings
          </h1>
          <p className="text-sm text-[#6B5E57] mt-1">
            Cloud-synced E-Vazhipadu receipts for {currentUser.email} · Cancellations open up to the previous day of pooja
          </p>
        </div>
        <button
          type="button"
          onClick={onExploreTemples}
          className="min-h-[42px] px-4 py-2 rounded-xl border border-[#DED4C6] bg-white hover:bg-[#FAF3E6] text-sm font-semibold text-[#1F1815] transition-colors self-start sm:self-auto cursor-pointer"
        >
          Book Another Vazhipadu
        </button>
      </div>

      {!bookingsLoading && bookings.length > 0 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div
            className="inline-flex items-center gap-1 p-1 bg-[#F2E7D3] border border-[#E5D3B3] rounded-xl"
            role="tablist"
            aria-label="Filter bookings by status"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ACTIVE'}
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors tabular-nums ${
                activeTab === 'ACTIVE'
                  ? 'bg-[#7A1C1C] text-white font-semibold'
                  : 'text-[#5C4E45] hover:text-[#1F1815]'
              }`}
            >
              Active Bookings ({activeBookings.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'CANCELLED'}
              onClick={() => setActiveTab('CANCELLED')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors tabular-nums ${
                activeTab === 'CANCELLED'
                  ? 'bg-[#7A1C1C] text-white font-semibold'
                  : 'text-[#5C4E45] hover:text-[#1F1815]'
              }`}
            >
              Cancelled ({cancelledBookings.length})
            </button>
          </div>
        </div>
      )}

      {bookingsError && (
        <div
          className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-[#7A1C1C]"
          role="alert"
        >
          {bookingsError}
        </div>
      )}

      {bookingsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[1, 2].map((skeleton) => (
            <div
              key={skeleton}
              className="bg-white border border-[#E5D3B3] rounded-2xl p-6 animate-pulse space-y-4"
            >
              <div className="h-4 w-32 bg-[#EFE7DB] rounded" />
              <div className="h-6 w-3/4 bg-[#EFE7DB] rounded" />
              <div className="h-16 w-full bg-[#FAF7F2] rounded-xl" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E6] border border-[#E5D3B3] text-[#D97706] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#1F1815] mb-1.5">
            No bookings found yet
          </h2>
          <p className="text-sm text-[#6B5E57] max-w-sm mx-auto mb-6">
            Explore Palakkad’s heritage temples to schedule your first Pushpanjali, Payasam, or Homam offering.
          </p>
          <button
            type="button"
            onClick={onExploreTemples}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Explore Palakkad Temples
          </button>
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="mt-6 bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FAF3E6] border border-[#E5D3B3] text-[#D97706] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#1F1815] mb-1.5">
            {activeTab === 'ACTIVE'
              ? 'No active Vazhipadu bookings'
              : 'No cancelled bookings'}
          </h2>
          <p className="text-sm text-[#6B5E57] max-w-sm mx-auto mb-6">
            {activeTab === 'ACTIVE'
              ? 'All previous bookings have been moved to the Cancelled tab. Schedule a new pooja anytime.'
              : 'Bookings you cancel prior to the pooja date will appear here for your reference.'}
          </p>
          {activeTab === 'ACTIVE' && (
            <button
              type="button"
              onClick={onExploreTemples}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Explore Palakkad Temples
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {visibleBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'CANCELLED';
            const eligibility = getCancellationEligibility(booking);

            return (
              <article
                key={booking.bookingId}
                className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-6 flex flex-col justify-between hover:border-[#D97706]/60 transition-colors"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B5E57]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#7A1C1C]">
                        {booking.bookingId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          isCancelled ? 'text-[#7A1C1C]' : 'text-emerald-700'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                      </span>
                    </div>
                    <span>
                      {booking.paymentMethod} · {booking.prasadamDelivery}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-semibold text-[#1F1815] mt-2">
                    {booking.templeName}
                  </h2>

                  <div className="mt-4 pt-3 border-t border-[#EFE4D2] space-y-2">
                    {booking.items.map((item, idx) => (
                      <div
                        key={`${booking.bookingId}-item-${idx}`}
                        className="flex items-baseline justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-[#1F1815]">
                            {item.poojaName} × {item.quantity}
                          </span>
                          <span className="text-[#6B5E57] block truncate">
                            {item.devoteeName} · {item.nakshatra} ·{' '}
                            {formatPoojaDateDisplay(item.poojaDate)}
                          </span>
                        </div>
                        <span className="font-mono text-[#1F1815] tabular-nums shrink-0">
                          {formatINR(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation Slot & Status Info */}
                  <div className="mt-4 pt-3 border-t border-[#EFE4D2] text-[11px] text-[#6B5E57] flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      {isCancelled ? (
                        <span className="text-[#7A1C1C] font-medium">
                          Cancelled
                          {booking.cancellationReason
                            ? ` — ${booking.cancellationReason}`
                            : ''}
                        </span>
                      ) : (
                        <span>{eligibility.reason}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#EFE4D2] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#6B5E57] block">
                      Total Paid
                    </span>
                    <span className="font-mono text-base font-bold text-[#1F1815] tabular-nums">
                      {formatINR(booking.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCancelled && (
                      <button
                        type="button"
                        disabled={!eligibility.eligible}
                        onClick={() => onCancelBooking(booking)}
                        title={eligibility.reason}
                        className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#DED4C6] bg-white hover:border-[#7A1C1C] hover:text-[#7A1C1C] text-xs font-semibold text-[#6B5E57] inline-flex items-center gap-1.5 transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectReceipt(booking)}
                      className="min-h-[40px] px-4 py-2 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      Ticket
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
