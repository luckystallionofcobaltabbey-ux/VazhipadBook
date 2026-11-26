import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Smartphone,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { formatINR, formatPoojaDateDisplay } from '../data/temples';
import type {
  BookingRecord,
  CartItem,
  PaymentMethod,
  PrasadamDeliveryMode,
} from '../types';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  prasadamDelivery: PrasadamDeliveryMode;
  onChangePrasadamDelivery: (mode: PrasadamDeliveryMode) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onClose: () => void;
  onRequireSignIn: () => void;
  onBookingCompleted: (booking: BookingRecord) => void;
  autoAdvanceToCheckout?: boolean;
  onResetAutoAdvance?: () => void;
}

export function CartCheckoutDrawer({
  isOpen,
  cart,
  prasadamDelivery,
  onChangePrasadamDelivery,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onClose,
  onRequireSignIn,
  onBookingCompleted,
  autoAdvanceToCheckout,
  onResetAutoAdvance,
}: CartCheckoutDrawerProps) {
  const { currentUser, userProfile, createBooking, isConfigured } = useFirebase();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.phone && !customerPhone) {
      setCustomerPhone(userProfile.phone);
    }
  }, [userProfile?.phone, customerPhone]);

  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && autoAdvanceToCheckout && currentUser && cart.length > 0) {
      setStep('checkout');
      onResetAutoAdvance?.();
    }
  }, [isOpen, autoAdvanceToCheckout, currentUser, cart.length, onResetAutoAdvance]);

  if (!isOpen) return null;

  const subtotalAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const convenienceFee = cart.length > 0 ? 5 : 0;
  const deliveryFee =
    cart.length > 0 && prasadamDelivery === 'Speed Post' ? 50 : 0;
  const totalAmount = subtotalAmount + convenienceFee + deliveryFee;
  const activeTempleName = cart[0]?.templeName || '';
  const activeTempleId = cart[0]?.templeId || '';

  const handleProceedToCheckout = () => {
    setError(null);
    if (!currentUser) {
      onRequireSignIn();
      return;
    }
    setStep('checkout');
  };

  const handlePayAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      onRequireSignIn();
      return;
    }

    const cleanPhone = customerPhone.trim();
    if (cleanPhone.length < 7 || cleanPhone.length > 20) {
      setError('Please enter a valid 10-digit mobile number for booking alerts.');
      return;
    }

    if (
      prasadamDelivery === 'Speed Post' &&
      deliveryAddress.trim().length < 10
    ) {
      setError(
        'Please enter a complete postal address (at least 10 characters) with PIN code for Speed Post Prasadam delivery.'
      );
      return;
    }

    if (!isConfigured) {
      setError('Firebase configuration is missing. Please add your credentials first.');
      return;
    }

    setSubmitting(true);
    try {
      // Brief gateway confirmation feel
      await new Promise((resolve) => setTimeout(resolve, 650));

      const customerName =
        userProfile?.name ||
        currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        'Devotee';
      const customerEmail =
        currentUser.email || userProfile?.email || 'devotee@vazhipadubook.in';

      const booking = await createBooking({
        templeId: activeTempleId,
        templeName: activeTempleName,
        items: cart,
        customerName,
        customerEmail,
        customerPhone: cleanPhone,
        prasadamDelivery,
        deliveryAddress:
          prasadamDelivery === 'Speed Post' ? deliveryAddress.trim() : '',
        paymentMethod,
      });

      onClearCart();
      setStep('cart');
      onBookingCompleted(booking);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to complete booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="bg-[#FAF7F2] w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-[#E8E0D5]">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep('cart');
                }}
                aria-label="Back to cart"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#1F1815] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2
                id="cart-drawer-title"
                className="font-display text-xl font-semibold text-[#1F1815]"
              >
                {step === 'cart' ? 'Your Vazhipadu Cart' : 'Checkout & Payment'}
              </h2>
              {activeTempleName && (
                <p className="text-xs text-[#6B5E57] truncate max-w-[260px]">
                  {activeTempleName}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#6B5E57] hover:bg-[#FAF7F2] hover:text-[#1F1815] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8E0D5] flex items-center justify-center mb-4 text-[#7A1C1C]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#1F1815] mb-1.5">
              No Vazhipadus Selected
            </h3>
            <p className="text-sm text-[#6B5E57] max-w-xs mb-6">
              Select a Palakkad temple and add Pushpanjali, Payasam, or Homam offerings with your Nakshatra details.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#7A1C1C] text-white text-sm font-semibold hover:bg-[#611414] transition-colors cursor-pointer"
            >
              Browse Palakkad Temples
            </button>
          </div>
        ) : step === 'cart' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Items */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-white border border-[#E8E0D5] rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-[#1F1815]">
                          {item.poojaName}
                        </h3>
                        <p className="text-xs text-[#6B5E57] mt-1">
                          {item.devoteeName} · {item.nakshatra}
                        </p>
                        <p className="text-xs text-[#6B5E57] mt-0.5">
                          {formatPoojaDateDisplay(item.poojaDate)} · {item.slot}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        aria-label={`Remove ${item.poojaName}`}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#8C7E74] hover:text-[#7A1C1C] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F3ECE2]">
                      <div className="inline-flex items-center border border-[#DED4C6] rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          aria-label="Decrease quantity"
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#1F1815] hover:bg-[#EFE7DB] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          aria-label="Increase quantity"
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#1F1815] hover:bg-[#EFE7DB] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#1F1815] tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prasadam Option */}
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#1F1815]">
                  Prasadam Fulfillment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangePrasadamDelivery('Counter Pickup')}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      prasadamDelivery === 'Counter Pickup'
                        ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C]'
                        : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Temple Counter</div>
                      <div className="text-[11px] opacity-75">Free pickup</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangePrasadamDelivery('Speed Post')}
                    className={`min-h-[48px] px-3.5 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      prasadamDelivery === 'Speed Post'
                        ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C]'
                        : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Speed Post</div>
                      <div className="text-[11px] opacity-75">+₹50 delivery</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Summary */}
            <div className="bg-white border-t border-[#E8E0D5] p-6 space-y-4 shrink-0">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6B5E57]">
                  <span>Vazhipadu Subtotal</span>
                  <span className="font-mono tabular-nums text-[#1F1815]">
                    {formatINR(subtotalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B5E57]">
                  <span>Convenience Fee</span>
                  <span className="font-mono tabular-nums text-[#1F1815]">
                    {formatINR(convenienceFee)}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#6B5E57]">
                    <span>Speed Post Prasadam</span>
                    <span className="font-mono tabular-nums text-[#1F1815]">
                      {formatINR(deliveryFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#F0EAE0] font-semibold text-base text-[#1F1815]">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums text-[#7A1C1C]">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#6B5E57]">
                Cancellation Slot: Eligible up to the previous day of the pooja date (11:59 PM IST).
              </p>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {currentUser
                  ? 'Proceed to Checkout'
                  : 'Sign In & Proceed to Checkout'}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handlePayAndBook} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && (
                <div
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#7A1C1C] leading-relaxed"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Account Holder & Contact */}
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#1F1815]">
                    Devotee Account &amp; Contact
                  </h3>
                  <span className="text-[11px] text-[#6B5E57]">
                    {currentUser?.email}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#1F1815] mb-1"
                  >
                    Mobile Number (for E-Vazhipadu SMS &amp; Postal updates)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      maxLength={20}
                      placeholder="+91 98460 12345"
                      className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#DED4C6] text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                      required
                    />
                  </div>
                </div>

                {prasadamDelivery === 'Speed Post' && (
                  <div>
                    <label
                      htmlFor="checkout-address"
                      className="block text-xs font-medium text-[#1F1815] mb-1"
                    >
                      Speed Post Delivery Address (with PIN Code)
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      maxLength={400}
                      placeholder="House / Flat Name, Street, Town, District, Kerala - 678001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED4C6] text-sm text-[#1F1815] focus:outline-none focus:ring-2 focus:ring-[#7A1C1C]/25 focus:border-[#7A1C1C]"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-semibold text-[#1F1815]">
                  Select Payment Method
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      {
                        id: 'UPI' as PaymentMethod,
                        label: 'UPI (GPay, PhonePe, Paytm, BHIM)',
                        icon: Smartphone,
                      },
                      {
                        id: 'Credit/Debit Card' as PaymentMethod,
                        label: 'Credit / Debit Card',
                        icon: CreditCard,
                      },
                      {
                        id: 'NetBanking' as PaymentMethod,
                        label: 'NetBanking',
                        icon: Landmark,
                      },
                    ] as const
                  ).map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-[#7A1C1C] bg-[#7A1C1C]/5 text-[#7A1C1C]'
                            : 'border-[#DED4C6] bg-white text-[#1F1815] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span className="flex items-center gap-3 text-sm font-medium">
                          <Icon className="w-4 h-4 shrink-0" />
                          {method.label}
                        </span>
                        {active && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Order Review */}
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-4 space-y-2.5">
                <h3 className="text-xs font-semibold text-[#1F1815]">
                  Offering Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h3>
                <div className="divide-y divide-[#F3ECE2]">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="py-2 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#1F1815]">
                          {item.poojaName} × {item.quantity}
                        </span>
                        <div className="text-[#6B5E57]">
                          {item.devoteeName} · {item.nakshatra} ·{' '}
                          {formatPoojaDateDisplay(item.poojaDate)}
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-[#1F1815] tabular-nums shrink-0">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment CTA */}
            <div className="bg-white border-t border-[#E8E0D5] p-6 space-y-3 shrink-0">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[#6B5E57]">
                  Total (incl. ₹5 convenience fee
                  {deliveryFee > 0 ? ' + ₹50 Speed Post' : ''})
                </span>
                <span className="font-mono text-lg font-bold text-[#7A1C1C] tabular-nums">
                  {formatINR(totalAmount)}
                </span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting
                  ? 'Processing Offering & Issuing Ticket...'
                  : `Pay ${formatINR(totalAmount)} via ${paymentMethod}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
