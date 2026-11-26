import { QRCodeSVG } from 'qrcode.react';
import {
  Ban,
  CheckCircle2,
  Download,
  MapPin,
  Printer,
  Truck,
  X,
} from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import {
  formatINR,
  formatPoojaDateDisplay,
  getCancellationEligibility,
  PALAKKAD_TEMPLES,
} from '../data/temples';
import type { BookingRecord } from '../types';

interface ReceiptModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onCancelBooking?: (booking: BookingRecord) => void;
}

export function ReceiptModal({
  booking,
  onClose,
  onCancelBooking,
}: ReceiptModalProps) {
  const { currentUser } = useFirebase();
  if (!booking) return null;

  const templeInfo = PALAKKAD_TEMPLES.find((t) => t.id === booking.templeId);
  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const isOwner = Boolean(currentUser && booking.userId === currentUser.uid);
  const eligibility = getCancellationEligibility(booking);

  const qrPayload = JSON.stringify({
    bookingId: booking.bookingId,
    status: booking.bookingStatus || 'CONFIRMED',
    temple: booking.templeName,
    total: booking.totalAmount,
    items: booking.items.map(
      (i) => `${i.poojaName} (${i.devoteeName} - ${i.nakshatra})`
    ),
  });

  const handleDownloadTextReceipt = () => {
    const lines = [
      '======================================================',
      '               VAZHIPADUBOOK - PALAKKAD               ',
      '            OFFICIAL E-VAZHIPADU RECEIPT              ',
      '======================================================',
      `Booking ID      : ${booking.bookingId}`,
      `Status          : ${isCancelled ? 'CANCELLED' : 'CONFIRMED'}`,
      `Transaction ID  : ${booking.transactionId}`,
      `Payment Method  : ${booking.paymentMethod} (${booking.paymentStatus})`,
      `Temple          : ${booking.templeName}`,
      `Locality        : ${templeInfo?.locality || 'Palakkad, Kerala'}`,
      `Devotee Account : ${booking.customerName} (${booking.customerPhone})`,
      `Prasadam Mode   : ${booking.prasadamDelivery}`,
      ...(booking.deliveryAddress
        ? [`Delivery Addr   : ${booking.deliveryAddress}`]
        : []),
      ...(isCancelled && booking.cancellationReason
        ? [`Cancel Reason   : ${booking.cancellationReason}`]
        : []),
      '------------------------------------------------------',
      'OFFERINGS & SANKALPAM DETAILS:',
      ...booking.items.map(
        (item, idx) =>
          `${idx + 1}. ${item.poojaName} x${item.quantity} | ${item.devoteeName} (${item.nakshatra}) | Date: ${formatPoojaDateDisplay(item.poojaDate)} | ₹${item.subtotal}`
      ),
      '------------------------------------------------------',
      `Subtotal        : ₹${booking.subtotalAmount}`,
      `Convenience Fee : ₹${booking.convenienceFee}`,
      `Speed Post Fee  : ₹${booking.deliveryFee}`,
      `TOTAL PAID      : ₹${booking.totalAmount}`,
      '======================================================',
      templeInfo?.counterNote ||
        'Please present this Booking ID at the Temple Devaswom Counter.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.bookingId}-E-Vazhipadu.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
    >
      <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto print-only-ticket">
        <div className="h-1.5 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
        {/* Top Banner */}
        <div
          className={`px-6 py-5 flex items-start justify-between gap-4 text-white ${
            isCancelled ? 'bg-[#3D2C29]' : 'bg-[#7A1C1C]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-medium">
              {isCancelled ? (
                <>
                  <Ban className="w-4 h-4" />
                  <span>Cancelled E-Vazhipadu Ticket</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed E-Vazhipadu Ticket</span>
                </>
              )}
            </div>
            <h2
              id="receipt-modal-title"
              className="font-display text-2xl font-semibold mt-1"
            >
              {booking.templeName}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              {templeInfo?.locality || 'Palakkad, Kerala'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close receipt modal"
            className="no-print min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking ID & QR */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-dashed border-[#D6CFC7]">
            <div className="space-y-2">
              <div>
                <span className="text-xs text-[#6B5E57] block">Booking Reference ID</span>
                <span className="font-mono text-xl font-bold text-[#7A1C1C] tracking-tight">
                  {booking.bookingId}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-1">
                <div>
                  <span className="text-[#6B5E57] block">Account Holder</span>
                  <span className="font-semibold text-[#1F1815]">
                    {booking.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B5E57] block">Contact Phone</span>
                  <span className="font-mono font-medium text-[#1F1815]">
                    {booking.customerPhone}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B5E57] block">Transaction Ref</span>
                  <span className="font-mono text-[#1F1815]">
                    {booking.transactionId}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B5E57] block">Paid Via</span>
                  <span className="font-medium text-[#1F1815]">
                    {booking.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl flex flex-col items-center shrink-0 self-center sm:self-auto">
              <QRCodeSVG
                value={qrPayload}
                size={96}
                bgColor="#FAF7F2"
                fgColor="#1F1815"
                level="M"
              />
              <span className="font-mono text-[10px] text-[#6B5E57] mt-1.5">
                {booking.bookingId}
              </span>
            </div>
          </div>

          {/* Itemized Devotee & Nakshatra Table */}
          <div>
            <h3 className="text-xs font-semibold text-[#6B5E57] mb-3">
              Sankalpam &amp; Vazhipadu Particulars
            </h3>
            <div className="border border-[#E8E0D5] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#6B5E57] border-b border-[#E8E0D5]">
                  <tr>
                    <th className="py-2.5 px-3.5 font-semibold">Vazhipadu</th>
                    <th className="py-2.5 px-3.5 font-semibold">Devotee &amp; Star</th>
                    <th className="py-2.5 px-3.5 font-semibold">Date</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE0]">
                  {booking.items.map((item, idx) => (
                    <tr key={`${item.poojaName}-${idx}`}>
                      <td className="py-3 px-3.5 font-medium text-[#1F1815]">
                        {item.poojaName}
                        <span className="block text-[11px] text-[#6B5E57]">
                          Qty {item.quantity} × {formatINR(item.unitPrice)}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-[#1F1815]">
                        <span className="font-medium">{item.devoteeName}</span>
                        <span className="block text-[11px] text-[#7A1C1C]">
                          {item.nakshatra}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-[#6B5E57] whitespace-nowrap">
                        {formatPoojaDateDisplay(item.poojaDate)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono font-semibold text-[#1F1815] tabular-nums">
                        {formatINR(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Breakdown & Counter Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-[#1F1815]">
                {booking.prasadamDelivery === 'Counter Pickup' ? (
                  <MapPin className="w-4 h-4 text-[#7A1C1C]" />
                ) : (
                  <Truck className="w-4 h-4 text-[#7A1C1C]" />
                )}
                <span>Prasadam: {booking.prasadamDelivery}</span>
              </div>
              <p className="text-[#6B5E57] leading-relaxed">
                {booking.prasadamDelivery === 'Counter Pickup'
                  ? templeInfo?.counterNote ||
                    'Present your Booking ID at the Temple Vazhipadu Counter 20 minutes before the pooja.'
                  : `Prasadam will be dispatched via India Post Speed Post to: ${booking.deliveryAddress}`}
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E8E0D5] rounded-xl p-4 text-xs space-y-1.5">
              <div className="flex justify-between text-[#6B5E57]">
                <span>Vazhipadu Subtotal</span>
                <span className="font-mono tabular-nums text-[#1F1815]">
                  {formatINR(booking.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B5E57]">
                <span>Convenience Fee</span>
                <span className="font-mono tabular-nums text-[#1F1815]">
                  {formatINR(booking.convenienceFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B5E57]">
                <span>Speed Post Delivery</span>
                <span className="font-mono tabular-nums text-[#1F1815]">
                  {formatINR(booking.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E0D5] font-semibold text-sm text-[#1F1815]">
                <span>Total Paid</span>
                <span className="font-mono tabular-nums text-[#7A1C1C]">
                  {formatINR(booking.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation Status Banner */}
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-[#7A1C1C] space-y-1">
              <div className="font-semibold">Booking Cancelled</div>
              <p>
                {booking.cancellationReason || 'Cancelled prior to pooja date'}
                {booking.cancelledBy ? ` · By ${booking.cancelledBy}` : ''}
              </p>
            </div>
          ) : (
            <div className="no-print bg-[#FAF3E6] border border-[#E5D3B3] rounded-xl px-4 py-2.5 text-[11px] text-[#6B5E57]">
              {isOwner ? (
                <>
                  <strong className="text-[#7A1C1C]">Cancellation Slot:</strong>{' '}
                  {eligibility.reason}
                </>
              ) : (
                <>
                  <strong className="text-[#7A1C1C]">Cancellation Policy:</strong>{' '}
                  Consumer-only cancellation (devotees may cancel up to the previous day of pooja).
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="no-print flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={handleDownloadTextReceipt}
              className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-[#DED4C6] bg-white hover:bg-[#FAF7F2] text-[#1F1815] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
            {isOwner && !isCancelled && eligibility.eligible && onCancelBooking && (
              <button
                type="button"
                onClick={() => onCancelBooking(booking)}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-[#7A1C1C] text-[#7A1C1C] hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
