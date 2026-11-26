import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Info,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';
import { formatINR, getTempleLiveStatus } from '../data/temples';
import type { CartItem, Pooja, PoojaCategory, Temple } from '../types';
import { TempleImage } from './TempleImage';

interface TempleDetailViewProps {
  temple: Temple;
  cart: CartItem[];
  onBack: () => void;
  onAddPoojaClick: (pooja: Pooja) => void;
  onUpdateCartQuantity: (cartItemId: string, delta: number) => void;
  onOpenCart: () => void;
}

const POOJA_CATEGORIES: readonly ('All' | PoojaCategory)[] = [
  'All',
  'Archana',
  'Abhishekam',
  'Payasam/Nivedyam',
  'Special Homam',
];

export function TempleDetailView({
  temple,
  cart,
  onBack,
  onAddPoojaClick,
  onUpdateCartQuantity,
  onOpenCart,
}: TempleDetailViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | PoojaCategory>('All');
  const liveStatus = getTempleLiveStatus(temple);

  const filteredPoojas = useMemo(() => {
    if (selectedCategory === 'All') return temple.poojas;
    return temple.poojas.filter((p) => p.category === selectedCategory);
  }, [temple.poojas, selectedCategory]);

  const templeCartItems = cart.filter((c) => c.templeId === temple.id);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-12">
      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="min-h-[40px] inline-flex items-center gap-2 text-sm font-medium text-[#6B5E57] hover:text-[#7A1C1C] transition-colors mb-5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Palakkad Temples</span>
      </button>

      {/* Temple Hero Banner */}
      <div className="bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl overflow-hidden shadow-xs">
        <div className="h-1.5 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
        <div className="relative h-56 sm:h-72 lg:h-80 w-full">
          <TempleImage
            src={temple.imageUrl}
            alt={temple.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#240808]/90 via-[#240808]/45 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-amber-200 font-medium mb-1.5">
              <span>{temple.deity}</span>
              <span aria-hidden="true">·</span>
              <span>{temple.locality}</span>
              <span aria-hidden="true">·</span>
              <span className={liveStatus.isOpen ? 'text-emerald-300' : 'text-amber-200'}>
                {liveStatus.statusText} ({liveStatus.subText})
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-semibold text-balance leading-tight">
              {temple.name}
            </h1>
          </div>
        </div>

        {/* Heritage, Timings & Dress Code */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-[#EFE4D2]">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-[#1F1815]">
              Temple Heritage &amp; Significance
            </h2>
            <p className="text-sm text-[#6B5E57] leading-relaxed">
              {temple.heritageNote}
            </p>
            <div className="pt-2 flex items-start gap-2.5 text-xs text-[#6B5E57]">
              <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1F1815]">Dress Code Reminder:</strong>{' '}
                {temple.dressCode}
              </span>
            </div>
            <div className="text-[11px] text-[#7D6E64]">
              Photo Source:{' '}
              <a
                href={temple.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#D97706]/60 hover:text-[#7A1C1C]"
              >
                {temple.imageAuthor} · {temple.imageLicense}
              </a>
            </div>
          </div>

          <div className="bg-[#FAF3E6] border border-[#E5D3B3] rounded-xl p-4 space-y-3 self-start">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A1C1C]">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <span>Darshan Timings (IST)</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-[#6B5E57]">Morning</span>
                <span className="font-mono font-medium text-[#1F1815]">
                  {temple.morningTiming}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#6B5E57]">Evening</span>
                <span className="font-mono font-medium text-[#1F1815]">
                  {temple.eveningTiming}
                </span>
              </div>
            </div>
            <div className="pt-2.5 border-t border-[#E5D3B3] flex items-start gap-2 text-[11px] text-[#6B5E57]">
              <MapPin className="w-3.5 h-3.5 text-[#7A1C1C] shrink-0 mt-0.5" />
              <span>{temple.counterNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Pooja / Vazhipadu Menu */}
      <div className="mt-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#1F1815]">
              Vazhipadu &amp; Pooja Offerings
            </h2>
            <p className="text-xs text-[#6B5E57] mt-0.5">
              Select an offering to enter Devotee Name &amp; Janma Nakshatra
            </p>
          </div>

          {/* Category Segmented Controls */}
          <div
            className="flex items-center gap-1 p-1 bg-[#EFE7DB] rounded-xl overflow-x-auto"
            role="tablist"
            aria-label="Filter poojas by category"
          >
            {POOJA_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-white text-[#7A1C1C] shadow-xs font-semibold'
                      : 'text-[#6B5E57] hover:text-[#1F1815]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pooja Rows */}
        <div className="bg-white border border-[#E8E0D5] rounded-2xl divide-y divide-[#F0EAE0] overflow-hidden">
          {filteredPoojas.map((pooja) => {
            const matchingEntries = templeCartItems.filter(
              (c) => c.poojaId === pooja.id
            );
            const totalForPooja = matchingEntries.reduce(
              (sum, entry) => sum + entry.quantity,
              0
            );
            const latestEntry = matchingEntries[matchingEntries.length - 1];

            return (
              <div
                key={pooja.id}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B5E57]">
                    <span className="font-medium text-[#D97706]">{pooja.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pooja.slot}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#1F1815]">
                    {pooja.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed">
                    {pooja.description}
                  </p>
                  {matchingEntries.length > 0 && (
                    <div className="pt-1 text-xs text-[#7A1C1C] font-medium">
                      Added for:{' '}
                      {matchingEntries
                        .map((e) => `${e.devoteeName} (${e.nakshatra})`)
                        .join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3ECE2]">
                  <span className="font-mono text-lg font-bold text-[#1F1815] tabular-nums">
                    {formatINR(pooja.price)}
                  </span>

                  {totalForPooja === 0 ? (
                    <button
                      type="button"
                      onClick={() => onAddPoojaClick(pooja)}
                      className="min-h-[42px] px-5 py-2 rounded-xl border border-[#7A1C1C] text-[#7A1C1C] hover:bg-[#7A1C1C] hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Add</span>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="inline-flex items-center rounded-xl bg-[#7A1C1C] text-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            latestEntry &&
                            onUpdateCartQuantity(latestEntry.cartItemId, -1)
                          }
                          aria-label={`Decrease ${pooja.name} quantity`}
                          className="min-h-[40px] min-w-[38px] flex items-center justify-center hover:bg-[#611414] transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums">
                          {totalForPooja}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            latestEntry &&
                            onUpdateCartQuantity(latestEntry.cartItemId, 1)
                          }
                          aria-label={`Increase ${pooja.name} quantity`}
                          className="min-h-[40px] min-w-[38px] flex items-center justify-center hover:bg-[#611414] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddPoojaClick(pooja)}
                        className="text-[11px] font-medium text-[#7A1C1C] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        Add another devotee
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating View Cart Bar on Desktop/Tablet when cart has items */}
      {totalCartCount > 0 && (
        <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-[#1F1815] text-white rounded-2xl px-6 py-3.5 shadow-xl items-center justify-between gap-8 min-w-[420px]">
          <div className="text-xs">
            <span className="text-amber-300 font-medium block">
              {totalCartCount} {totalCartCount === 1 ? 'Vazhipadu' : 'Vazhipadus'} in Cart
            </span>
            <span className="font-mono text-sm font-bold tabular-nums">
              {formatINR(totalCartAmount)} + ₹5 fee
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenCart}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            View Cart &amp; Checkout
          </button>
        </div>
      )}
    </div>
  );
}
