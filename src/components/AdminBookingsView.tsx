import { useMemo, useState } from 'react';
import { Ban, QrCode, Search, ShieldCheck, X } from 'lucide-react';
import { ADMIN_EMAIL, useFirebase } from '../contexts/FirebaseContext';
import { formatINR, formatPoojaDateDisplay, PALAKKAD_TEMPLES } from '../data/temples';
import type { BookingRecord } from '../types';

interface AdminBookingsViewProps {
  onSelectReceipt: (booking: BookingRecord) => void;
  onCancelBooking: (booking: BookingRecord) => void;
}

export function AdminBookingsView({
  onSelectReceipt,
  onCancelBooking,
}: AdminBookingsViewProps) {
  const {
    isAdmin,
    adminBookings,
    adminBookingsLoading,
    adminBookingsError,
  } = useFirebase();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [templeFilter, setTempleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return adminBookings.filter((b) => {
      const status = b.bookingStatus || 'CONFIRMED';
      if (statusFilter !== 'ALL' && status !== statusFilter) return false;
      if (templeFilter !== 'ALL' && b.templeId !== templeFilter) return false;
      if (!q) return true;
      return (
        b.bookingId.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.items.some(
          (i) =>
            i.devoteeName.toLowerCase().includes(q) ||
            i.poojaName.toLowerCase().includes(q)
        )
      );
    });
  }, [adminBookings, statusFilter, templeFilter, searchQuery]);

  if (!isAdmin) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-[#1F1815] mb-2">
            Admin Access Required
          </h1>
          <p className="text-sm text-[#6B5E57]">
            Please sign in with the authorized admin account ({ADMIN_EMAIL}) to manage temple bookings.
          </p>
        </div>
      </section>
    );
  }

  const confirmedList = adminBookings.filter(
    (b) => (b.bookingStatus || 'CONFIRMED') === 'CONFIRMED'
  );
  const cancelledList = adminBookings.filter(
    (b) => b.bookingStatus === 'CANCELLED'
  );
  const confirmedRevenue = confirmedList.reduce(
    (sum, b) => sum + b.totalAmount,
    0
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 md:pb-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E5D3B3]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1C1C] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>Temple Admin Console · {ADMIN_EMAIL}</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#1F1815]">
            All Palakkad Vazhipadu Bookings
          </h1>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-[#6B5E57] block">Total Bookings</span>
          <span className="font-mono text-2xl font-bold text-[#1F1815] tabular-nums mt-1 block">
            {adminBookings.length}
          </span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-[#6B5E57] block">Confirmed Offerings</span>
          <span className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-1 block">
            {confirmedList.length}
          </span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-[#6B5E57] block">Cancelled Bookings</span>
          <span className="font-mono text-2xl font-bold text-[#7A1C1C] tabular-nums mt-1 block">
            {cancelledList.length}
          </span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-4 sm:p-5">
          <span className="text-xs text-[#6B5E57] block">Confirmed Collection</span>
          <span className="font-mono text-2xl font-bold text-[#1F1815] tabular-nums mt-1 block">
            {formatINR(confirmedRevenue)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Booking ID, devotee, email, or phone..."
            className="w-full min-h-[42px] pl-10 pr-9 py-2 rounded-xl border border-[#DED4C6] bg-white text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#6B5E57] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Filter by temple"
            value={templeFilter}
            onChange={(e) => setTempleFilter(e.target.value)}
            className="min-h-[42px] px-3.5 py-2 rounded-xl border border-[#DED4C6] bg-white text-xs font-medium text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25"
          >
            <option value="ALL">All Palakkad Temples</option>
            {PALAKKAD_TEMPLES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 p-1 bg-[#F2E7D3] border border-[#E5D3B3] rounded-xl">
            {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                  statusFilter === status
                    ? 'bg-[#7A1C1C] text-white font-semibold'
                    : 'text-[#5C4E45] hover:text-[#1F1815]'
                }`}
              >
                {status === 'ALL'
                  ? 'All'
                  : status === 'CONFIRMED'
                  ? 'Confirmed'
                  : 'Cancelled'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {adminBookingsError && (
        <div
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-[#7A1C1C]"
          role="alert"
        >
          {adminBookingsError}
        </div>
      )}

      {adminBookingsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-white border border-[#E5D3B3] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-10 text-center text-sm text-[#6B5E57]">
          No bookings match the current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'CANCELLED';
            return (
              <article
                key={booking.bookingId}
                className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-mono font-bold text-[#7A1C1C]">
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
                    <span aria-hidden="true">·</span>
                    <span className="text-[#6B5E57]">
                      {booking.customerName} ({booking.customerEmail} ·{' '}
                      {booking.customerPhone})
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-semibold text-[#1F1815]">
                    {booking.templeName}
                  </h2>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B5E57]">
                    {booking.items.map((item, idx) => (
                      <span key={`${booking.bookingId}-a-${idx}`}>
                        <strong className="text-[#1F1815]">
                          {item.poojaName} × {item.quantity}
                        </strong>{' '}
                        ({item.devoteeName}, {item.nakshatra} ·{' '}
                        {formatPoojaDateDisplay(item.poojaDate)})
                      </span>
                    ))}
                  </div>

                  {isCancelled && booking.cancellationReason && (
                    <p className="text-xs text-[#7A1C1C]">
                      Cancelled by {booking.cancelledBy || 'User'}:{' '}
                      {booking.cancellationReason}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#EFE4D2]">
                  <div className="mr-2">
                    <span className="text-[11px] text-[#6B5E57] block">
                      {booking.prasadamDelivery}
                    </span>
                    <span className="font-mono text-base font-bold text-[#1F1815] tabular-nums">
                      {formatINR(booking.totalAmount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectReceipt(booking)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#DED4C6] bg-white hover:bg-[#FAF3E6] text-xs font-semibold text-[#1F1815] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    Ticket
                  </button>

                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => onCancelBooking(booking)}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-[#7A1C1C] text-[#7A1C1C] hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Ban className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
