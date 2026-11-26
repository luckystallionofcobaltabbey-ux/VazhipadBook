import { useMemo, useState } from 'react';
import {
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { formatINR, getTempleLiveStatus } from '../data/temples';
import type { DiscoveryFilter, Temple } from '../types';
import { TempleImage } from './TempleImage';

interface ExploreTemplesViewProps {
  temples: Temple[];
  onSelectTemple: (temple: Temple) => void;
}

const DISCOVERY_FILTERS: readonly DiscoveryFilter[] = [
  'All',
  'Bhagavathy',
  'Shiva',
  'Homam',
  'Nivedyam',
];

export function ExploreTemplesView({
  temples,
  onSelectTemple,
}: ExploreTemplesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DiscoveryFilter>('All');
  const [showCityNotice, setShowCityNotice] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTemples = useMemo(() => {
    return temples
      .map((temple) => {
        const matchesFilter =
          activeFilter === 'All' ||
          (activeFilter === 'Bhagavathy' && temple.deityFilter === 'Bhagavathy') ||
          (activeFilter === 'Shiva' && temple.deityFilter === 'Shiva') ||
          (activeFilter === 'Homam' &&
            temple.poojas.some(
              (p) =>
                p.category === 'Special Homam' ||
                p.name.toLowerCase().includes('homam')
            )) ||
          (activeFilter === 'Nivedyam' &&
            temple.poojas.some((p) => p.category === 'Payasam/Nivedyam'));

        if (!matchesFilter) return null;

        const matchingPoojas = normalizedQuery
          ? temple.poojas.filter(
              (p) =>
                p.name.toLowerCase().includes(normalizedQuery) ||
                p.category.toLowerCase().includes(normalizedQuery)
            )
          : [];

        const matchesSearch =
          !normalizedQuery ||
          temple.name.toLowerCase().includes(normalizedQuery) ||
          temple.locality.toLowerCase().includes(normalizedQuery) ||
          temple.deity.toLowerCase().includes(normalizedQuery) ||
          matchingPoojas.length > 0;

        if (!matchesSearch) return null;

        return {
          temple,
          matchingPoojas,
        };
      })
      .filter((entry): entry is { temple: Temple; matchingPoojas: Temple['poojas'] } =>
        Boolean(entry)
      );
  }, [temples, activeFilter, normalizedQuery]);

  return (
    <div className="pb-24 md:pb-14">
      {/* Auspicious Hero Banner */}
      <section className="relative w-full bg-[#2A0A0A] overflow-hidden border-b-2 border-[#D97706]/40">
        <img
          src="/src/assets/images/hero_palakkad_temple_1795699281062.jpg"
          alt="Serene Kerala temple courtyard in Palakkad illuminated by brass oil lamps"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#280909]/95 via-[#3B1010]/70 to-[#1D0B08]/45" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-2xl space-y-4">
            {/* Auspicious Greeting & Locked Palakkad Location */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Subham · Sacred Vazhipadu Portal</span>
              </span>
              <span className="text-white/40" aria-hidden="true">
                |
              </span>
              <div className="inline-flex items-center gap-1.5 text-amber-100">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Palakkad, Kerala</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCityNotice((prev) => !prev)}
                className="text-amber-200/90 hover:text-amber-100 underline underline-offset-4 transition-colors cursor-pointer"
              >
                Change City (Coming Soon)
              </button>
            </div>

            {showCityNotice && (
              <div className="bg-black/65 backdrop-blur-xs border border-amber-300/35 rounded-xl px-4 py-2.5 text-xs text-amber-100 flex items-center justify-between gap-4 max-w-md">
                <span>
                  VazhipaduBook is currently live exclusively for Palakkad’s heritage temples. Thrissur &amp; Kozhikode launching soon.
                </span>
                <button
                  type="button"
                  onClick={() => setShowCityNotice(false)}
                  aria-label="Dismiss city notice"
                  className="text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#FFFBF2] text-balance leading-[1.15]">
              Book Sacred Vazhipadus in Palakkad’s Heritage Temples
            </h1>
            <p className="text-sm sm:text-base text-amber-50/85 max-w-xl leading-relaxed">
              Reserve Pushpanjali, Paal Payasam, Rudrabhishekam, and Special Homams with Janma Nakshatra Sankalpam and instant E-Vazhipadu receipts.
            </p>

            {/* Search Bar */}
            <div className="pt-2">
              <div className="relative max-w-xl">
                <Search className="w-4 h-4 text-[#7A1C1C] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by temple or pooja (e.g., Payasam, Homam, Kalpathy)..."
                  aria-label="Search Palakkad temples or poojas"
                  className="w-full min-h-[48px] pl-11 pr-10 py-3 rounded-xl bg-[#FFFDF9] border border-[#E5D3B3] text-sm text-[#1F1815] placeholder:text-[#8C7E74] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B5E57] hover:text-[#1F1815] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar & Temple Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5D3B3]">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1F1815]">
              Temples in Palakkad
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5E57] mt-0.5">
              Showing {filteredTemples.length}{' '}
              {filteredTemples.length === 1 ? 'temple' : 'temples'} with live IST darshan status
            </p>
          </div>

          {/* Interactive Category Filter Segmented Control */}
          <div
            className="flex items-center gap-1 p-1 bg-[#F2E7D3] border border-[#E5D3B3] rounded-xl overflow-x-auto"
            role="tablist"
            aria-label="Filter temples by deity or offering"
          >
            {DISCOVERY_FILTERS.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#7A1C1C] text-white shadow-xs font-semibold'
                      : 'text-[#5C4E45] hover:text-[#1F1815]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredTemples.length === 0 ? (
          <div className="mt-10 bg-white border border-[#E5D3B3] rounded-2xl p-10 text-center">
            <h3 className="font-display text-xl font-semibold text-[#1F1815] mb-2">
              No matching temples or vazhipadus
            </h3>
            <p className="text-sm text-[#6B5E57] mb-5">
              Try clearing your search filter or searching for another offering like Pushpanjali, Paal Payasam, or Homam.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="min-h-[42px] px-5 py-2 rounded-xl bg-[#7A1C1C] text-white text-xs font-semibold hover:bg-[#611414] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-8">
            {filteredTemples.map(({ temple, matchingPoojas }) => {
              const liveStatus = getTempleLiveStatus(temple);
              const startingPrice = Math.min(...temple.poojas.map((p) => p.price));

              return (
                <article
                  key={temple.id}
                  onClick={() => onSelectTemple(temple)}
                  className="group bg-[#FFFDF9] border border-[#E5D3B3] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#D97706]/60 hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
                >
                  <div className="h-1 bg-gradient-to-r from-[#7A1C1C] via-[#D97706] to-[#7A1C1C]" />
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFE7DB]">
                    <TempleImage
                      src={temple.imageUrl}
                      alt={temple.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Clean unboxed metadata line */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6B5E57]">
                        <span className="font-semibold text-[#7A1C1C]">
                          {temple.deity}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{temple.locality}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            liveStatus.isOpen ? 'text-emerald-700' : 'text-[#B45309]'
                          }`}
                        >
                          {liveStatus.statusText} ({liveStatus.subText})
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#1F1815] group-hover:text-[#7A1C1C] transition-colors">
                        {temple.name}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-[#6B5E57] pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        <span>
                          Morning {temple.morningTiming} · Evening {temple.eveningTiming}
                        </span>
                      </div>

                      {/* Open-License Photo Attribution */}
                      <div className="text-[11px] text-[#7D6E64]">
                        Photo:{' '}
                        <a
                          href={temple.imageSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="underline decoration-[#D97706]/50 hover:text-[#7A1C1C] inline-flex items-center gap-1"
                        >
                          <span>
                            {temple.imageAuthor} · {temple.imageLicense}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Highlight matching poojas if user searched for a pooja */}
                      {matchingPoojas.length > 0 && (
                        <div className="pt-2 border-t border-[#F0E3CC] text-xs space-y-1">
                          <span className="text-[#6B5E57] font-medium block">
                            Matching Vazhipadus:
                          </span>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[#1F1815]">
                            {matchingPoojas.slice(0, 3).map((p) => (
                              <span key={p.id} className="font-medium">
                                {p.name}{' '}
                                <span className="font-mono text-[#7A1C1C]">
                                  ({formatINR(p.price)})
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#EFE4D2] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#6B5E57] block">
                          Vazhipadus starting from
                        </span>
                        <span className="font-mono text-base font-bold text-[#1F1815] tabular-nums">
                          {formatINR(startingPrice)}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF1E0] border border-[#E5D3B3] group-hover:bg-[#7A1C1C] group-hover:border-[#7A1C1C] text-[#7A1C1C] group-hover:text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0">
                        Book Poojas
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
