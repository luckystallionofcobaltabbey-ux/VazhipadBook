import { useState } from 'react';
import {
  AlertCircle,
  Building2,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  User,
} from 'lucide-react';
import { AdminBookingsView } from './components/AdminBookingsView';
import { CancelBookingModal } from './components/CancelBookingModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { DevoteeDetailsModal } from './components/DevoteeDetailsModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExploreTemplesView } from './components/ExploreTemplesView';
import { MyBookingsView } from './components/MyBookingsView';
import { ReceiptModal } from './components/ReceiptModal';
import { SignInModal } from './components/SignInModal';
import { TempleDetailView } from './components/TempleDetailView';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { PALAKKAD_TEMPLES } from './data/temples';
import type {
  ActiveView,
  BookingRecord,
  CartItem,
  Pooja,
  PrasadamDeliveryMode,
  Temple,
} from './types';

function VazhipaduBookShell() {
  const { currentUser, userProfile, isAdmin, logout, isConfigured } =
    useFirebase();

  const [activeView, setActiveView] = useState<ActiveView>('explore');
  const [selectedTempleId, setSelectedTempleId] = useState<string>(
    PALAKKAD_TEMPLES[0].id
  );

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [prasadamDelivery, setPrasadamDelivery] =
    useState<PrasadamDeliveryMode>('Counter Pickup');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [autoAdvanceToCheckout, setAutoAdvanceToCheckout] = useState(false);

  // Modals
  const [poojaModalState, setPoojaModalState] = useState<{
    temple: Temple;
    pooja: Pooja;
  } | null>(null);
  const [switchTemplePrompt, setSwitchTemplePrompt] = useState<{
    temple: Temple;
    pooja: Pooja;
  } | null>(null);

  const [signInModalState, setSignInModalState] = useState<{
    open: boolean;
    reason?: string;
    afterAuth?: 'checkout' | 'bookings';
  }>({ open: false });

  const [activeReceipt, setActiveReceipt] = useState<BookingRecord | null>(null);
  const [cancelTargetBooking, setCancelTargetBooking] =
    useState<BookingRecord | null>(null);

  const selectedTemple =
    PALAKKAD_TEMPLES.find((t) => t.id === selectedTempleId) ||
    PALAKKAD_TEMPLES[0];

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenTemple = (temple: Temple) => {
    setSelectedTempleId(temple.id);
    setActiveView('temple');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPoojaClick = (temple: Temple, pooja: Pooja) => {
    // Keep cart scoped to one temple per booking receipt
    if (cart.length > 0 && cart[0].templeId !== temple.id) {
      setSwitchTemplePrompt({ temple, pooja });
      return;
    }
    setPoojaModalState({ temple, pooja });
  };

  const handleConfirmDevoteeDetails = (payload: {
    temple: Temple;
    pooja: Pooja;
    devoteeName: string;
    nakshatra: string;
    poojaDate: string;
    quantity: number;
    prasadamMode: PrasadamDeliveryMode;
  }) => {
    const newItem: CartItem = {
      cartItemId: `${payload.pooja.id}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      templeId: payload.temple.id,
      templeName: payload.temple.name,
      poojaId: payload.pooja.id,
      poojaName: payload.pooja.name,
      category: payload.pooja.category,
      unitPrice: payload.pooja.price,
      quantity: payload.quantity,
      devoteeName: payload.devoteeName,
      nakshatra: payload.nakshatra,
      poojaDate: payload.poojaDate,
      slot: payload.pooja.slot,
    };

    setCart((prev) => [...prev, newItem]);
    setPrasadamDelivery(payload.prasadamMode);
    setPoojaModalState(null);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleNavigateMyBookings = () => {
    if (!currentUser) {
      setSignInModalState({
        open: true,
        reason: 'Please sign in to view your cloud-synced E-Vazhipadu bookings.',
        afterAuth: 'bookings',
      });
      return;
    }
    setActiveView('bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    const intent = signInModalState.afterAuth;
    setSignInModalState({ open: false });
    if (intent === 'bookings') {
      setActiveView('bookings');
    } else if (intent === 'checkout') {
      setAutoAdvanceToCheckout(true);
      setIsCartOpen(true);
    }
  };

  const displayFirstName =
    (userProfile?.name || currentUser?.displayName || currentUser?.email || 'Account')
      .split(' ')[0]
      .slice(0, 14);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F1815]">
      {/* Graceful Placeholder Banner if Firebase keys are still placeholders */}
      {!isConfigured && (
        <div className="no-print bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-950 flex items-center justify-center gap-2 text-center">
          <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            Firebase configuration uses placeholder keys. Paste your Firebase credentials into{' '}
            <code className="font-mono font-semibold">firebase-applet-config.json</code> or{' '}
            <code className="font-mono font-semibold">src/firebaseConfig.ts</code> to enable cloud bookings and sign-in.
          </span>
        </div>
      )}

      {/* Top Navigation Bar (Desktop 3-Zone Contract + Compact Mobile Bar) */}
      <header className="no-print sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E5D3B3]">
        <div className="h-1 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[50px] md:h-15 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('explore')}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#7A1C1C] whitespace-nowrap shrink-0 cursor-pointer"
          >
            VazhipaduBook
          </button>

          {/* Zone 2: Clean Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5E57]"
            aria-label="Primary navigation"
          >
            <button
              type="button"
              onClick={() => setActiveView('explore')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeView === 'explore' || activeView === 'temple'
                  ? 'border-[#7A1C1C] text-[#7A1C1C] font-semibold'
                  : 'border-transparent hover:text-[#1F1815]'
              }`}
            >
              Temples
            </button>
            <button
              type="button"
              onClick={handleNavigateMyBookings}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeView === 'bookings'
                  ? 'border-[#7A1C1C] text-[#7A1C1C] font-semibold'
                  : 'border-transparent hover:text-[#1F1815]'
              }`}
            >
              My Bookings
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#1F1815] transition-colors cursor-pointer tabular-nums"
            >
              Cart ({totalCartItems})
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeView === 'admin'
                    ? 'border-[#7A1C1C] text-[#7A1C1C] font-semibold'
                    : 'border-transparent hover:text-[#1F1815]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Single Primary Account / Sign-In Action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNavigateMyBookings}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#FAF3E6] border border-[#E5D3B3] text-xs font-semibold text-[#1F1815] hover:border-[#7A1C1C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {displayFirstName}
                </button>
                <button
                  type="button"
                  onClick={() => void logout()}
                  aria-label="Sign out"
                  title="Sign out"
                  className="hidden md:flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl text-[#6B5E57] hover:bg-[#FAF3E6] hover:text-[#7A1C1C] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setSignInModalState({
                    open: true,
                    reason:
                      'Continue with Google to sync your Palakkad temple bookings and E-Vazhipadu receipts.',
                  })
                }
                className="min-h-[38px] md:min-h-[40px] px-4 py-2 rounded-xl bg-[#7A1C1C] hover:bg-[#611414] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Continue with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeView === 'explore' && (
          <ExploreTemplesView
            temples={PALAKKAD_TEMPLES}
            onSelectTemple={handleOpenTemple}
          />
        )}

        {activeView === 'temple' && (
          <TempleDetailView
            temple={selectedTemple}
            cart={cart}
            onBack={() => setActiveView('explore')}
            onAddPoojaClick={(pooja) => handleAddPoojaClick(selectedTemple, pooja)}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeView === 'bookings' && (
          <MyBookingsView
            onSelectReceipt={(booking) => setActiveReceipt(booking)}
            onCancelBooking={(booking) => setCancelTargetBooking(booking)}
            onExploreTemples={() => setActiveView('explore')}
            onOpenSignIn={() =>
              setSignInModalState({
                open: true,
                afterAuth: 'bookings',
              })
            }
          />
        )}

        {activeView === 'admin' && (
          <AdminBookingsView
            onSelectReceipt={(booking) => setActiveReceipt(booking)}
            onCancelBooking={(booking) => setCancelTargetBooking(booking)}
          />
        )}
      </main>

      {/* Clean Footer with Temple Photo Open-License Sources */}
      <footer className="no-print border-t border-[#E5D3B3] bg-[#FFFDF9] py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 text-xs text-[#6B5E57]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="font-semibold text-[#7A1C1C]">
              VazhipaduBook · Palakkad, Kerala · Authentic Temple Pooja &amp; Prasadam Bookings
            </span>
            <span>
              Kalpathy · Manapullikavu · Kallekulangara Emoor · Thiruvalathur
            </span>
          </div>
          <div className="pt-3 border-t border-[#F0E5D1] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
            <span className="font-semibold text-[#1F1815]">
              Open-License Photo Credits:
            </span>
            {PALAKKAD_TEMPLES.map((t) => (
              <a
                key={t.id}
                href={t.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#D97706]/50 hover:text-[#7A1C1C]"
              >
                {t.name.split('(')[0].trim()} ({t.imageLicense})
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation Bar (under 15% mobile sticky cap) */}
      <nav
        className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E0D5]"
        aria-label="Mobile bottom navigation"
      >
        <div className={`grid h-[60px] ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <button
            type="button"
            onClick={() => setActiveView('explore')}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
              activeView === 'explore' || activeView === 'temple'
                ? 'text-[#7A1C1C] font-semibold'
                : 'text-[#6B5E57]'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Temples</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#6B5E57] cursor-pointer relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="tabular-nums">
              Cart{totalCartItems > 0 ? ` (${totalCartItems})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={handleNavigateMyBookings}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
              activeView === 'bookings'
                ? 'text-[#7A1C1C] font-semibold'
                : 'text-[#6B5E57]'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span>Bookings</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                activeView === 'admin'
                  ? 'text-[#7A1C1C] font-semibold'
                  : 'text-[#6B5E57]'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (currentUser) {
                void logout();
              } else {
                setSignInModalState({ open: true });
              }
            }}
            className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-[#6B5E57] cursor-pointer"
          >
            {currentUser ? (
              <>
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Switch Temple Confirmation Modal */}
      {switchTemplePrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E8E0D5] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#1F1815]">
              Start a new temple cart?
            </h2>
            <p className="text-sm text-[#6B5E57] leading-relaxed">
              Your cart currently contains offerings for{' '}
              <strong className="text-[#1F1815]">{cart[0]?.templeName}</strong>.
              Each E-Vazhipadu receipt is issued per temple. Replace your cart with{' '}
              <strong className="text-[#1F1815]">
                {switchTemplePrompt.temple.name}
              </strong>
              ?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSwitchTemplePrompt(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-[#DED4C6] text-xs font-semibold text-[#1F1815] hover:bg-[#FAF7F2] cursor-pointer"
              >
                Keep Current Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = switchTemplePrompt;
                  setCart([]);
                  setSwitchTemplePrompt(null);
                  setPoojaModalState(next);
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#7A1C1C] text-white text-xs font-semibold hover:bg-[#611414] cursor-pointer"
              >
                Switch Temple
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Devotee Details & Nakshatra Modal */}
      <DevoteeDetailsModal
        isOpen={Boolean(poojaModalState)}
        temple={poojaModalState?.temple || null}
        pooja={poojaModalState?.pooja || null}
        currentPrasadamMode={prasadamDelivery}
        onClose={() => setPoojaModalState(null)}
        onConfirm={handleConfirmDevoteeDetails}
      />

      {/* Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        cart={cart}
        prasadamDelivery={prasadamDelivery}
        onChangePrasadamDelivery={setPrasadamDelivery}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onClose={() => setIsCartOpen(false)}
        onRequireSignIn={() => {
          setIsCartOpen(false);
          setSignInModalState({
            open: true,
            reason:
              'Please sign in to complete checkout and save your E-Vazhipadu ticket.',
            afterAuth: 'checkout',
          });
        }}
        onBookingCompleted={(booking) => {
          setIsCartOpen(false);
          setActiveReceipt(booking);
        }}
        autoAdvanceToCheckout={autoAdvanceToCheckout}
        onResetAutoAdvance={() => setAutoAdvanceToCheckout(false)}
      />

      {/* Sign-In Modal */}
      <SignInModal
        isOpen={signInModalState.open}
        reason={signInModalState.reason}
        onClose={() => setSignInModalState({ open: false })}
        onSuccess={handleAuthSuccess}
      />

      {/* Digital E-Vazhipadu Ticket Modal */}
      <ReceiptModal
        booking={activeReceipt}
        onClose={() => setActiveReceipt(null)}
        onCancelBooking={(booking) => {
          setActiveReceipt(null);
          setCancelTargetBooking(booking);
        }}
      />

      {/* Cancellation Confirmation Modal */}
      <CancelBookingModal
        booking={cancelTargetBooking}
        onClose={() => setCancelTargetBooking(null)}
        onCancelled={() => {
          setCancelTargetBooking(null);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <VazhipaduBookShell />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
