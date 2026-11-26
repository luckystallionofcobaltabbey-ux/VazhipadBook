import type { Temple } from '../types';

export const MALAYALAM_NAKSHATRAS: readonly string[] = [
  'Ashwathi',
  'Bharani',
  'Karthika',
  'Rohini',
  'Makayiram',
  'Thiruvathira',
  'Punartham',
  'Pooyam',
  'Ayilyam',
  'Makam',
  'Pooram',
  'Uthram',
  'Atham',
  'Chithira',
  'Chothi',
  'Vishakham',
  'Anizham',
  'Thriketta',
  'Moolam',
  'Pooradam',
  'Uthradam',
  'Thiruvonam',
  'Avittam',
  'Chathayam',
  'Pururuttathi',
  'Uthrattathi',
  'Revathi',
] as const;

export const PALAKKAD_TEMPLES: Temple[] = [
  {
    id: 'kalpathy-viswanatha',
    name: 'Kalpathy Sri Viswanatha Swamy Temple',
    locality: 'Heritage Village, Kalpathy, Palakkad',
    deity: 'Lord Shiva',
    deityFilter: 'Shiva',
    imageUrl: '/src/assets/images/real/kalpathy_viswanatha.jpg',
    imageAuthor: 'Itsn4kul10 (Wikimedia Commons)',
    imageLicense: 'CC BY-SA 4.0',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Viswanatha_Swamy_temple.jpg',
    morningTiming: '5:30 AM – 10:30 AM',
    eveningTiming: '5:00 PM – 8:00 PM',
    windows: [
      { startMinutes: 5 * 60 + 30, endMinutes: 10 * 60 + 30, label: 'Morning Darshan' },
      { startMinutes: 17 * 60, endMinutes: 20 * 60, label: 'Evening Darshan' },
    ],
    heritageNote:
      'Built in 1425 AD along the banks of the Kalpathy River (Neela Nadi), this revered shrine is revered as Dakshina Kashi and anchors the annual Kalpathy Ratholsavam.',
    dressCode:
      'Traditional Kerala attire recommended (Mundu / Veshti for men without shirts inside the Sanctum; Saree, Kasavu Set, or Salwar for women).',
    counterNote:
      'Present your E-Vazhipadu Booking ID at the Eastern Gopuram Vazhipadu Counter 20 minutes prior to your slot.',
    poojas: [
      {
        id: 'kal-pushpanjali',
        name: 'Pushpanjali',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Sacred floral archana chanted with the devotee’s Janma Nakshatra for peace, clarity, and wellbeing.',
      },
      {
        id: 'kal-neyvilakku',
        name: 'Neyvilakku',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Offering of pure cow-ghee lamp lighting before Sri Viswanatha Swamy to dispel obstacles and illuminate the household.',
      },
      {
        id: 'kal-paal-payasam',
        name: 'Paal Payasam',
        category: 'Payasam/Nivedyam',
        price: 100,
        slot: 'Morning',
        description:
          'Traditional temple milk-and-rice nivedyam slow-simmered in bronze uruli and distributed as sacred prasadam.',
      },
      {
        id: 'kal-rudrabhishekam',
        name: 'Rudrabhishekam',
        category: 'Abhishekam',
        price: 150,
        slot: 'Morning',
        description:
          'Vedic chanting of Sri Rudram accompanied by sacred abhishekam for vitality, inner strength, and family harmony.',
      },
      {
        id: 'kal-ganapathy-homam',
        name: 'Ganapathy Homam',
        category: 'Special Homam',
        price: 150,
        slot: 'Morning',
        description:
          'Dawn fire ritual invoking Lord Vigneswara before auspicious beginnings, new ventures, and milestone dates.',
      },
      {
        id: 'kal-pradosha-abhishekam',
        name: 'Pradosha Abhishekam',
        category: 'Abhishekam',
        price: 250,
        slot: 'Evening',
        description:
          'Special twilight abhishekam with bilva leaves and sandalwood paste seeking Lord Shiva’s grace.',
      },
      {
        id: 'kal-mrityunjaya-homam',
        name: 'Mrityunjaya Homam',
        category: 'Special Homam',
        price: 350,
        slot: 'Morning',
        description:
          'Dedicated Vedic homam chanting the Maha Mrityunjaya Mantra for longevity, recovery, and protection.',
      },
      {
        id: 'kal-chuttuvilakku',
        name: 'Chuttuvilakku',
        category: 'Special Homam',
        price: 2500,
        slot: 'Evening',
        description:
          'Grand illumination of all brass oil lamps lining the outer Nalambalam walls during Deeparadhana.',
      },
    ],
  },
  {
    id: 'manapullikavu-bhagavathy',
    name: 'Manapullikavu Bhagavathy Temple',
    locality: 'Kallikad, Palakkad',
    deity: 'Goddess Bhagavathy',
    deityFilter: 'Bhagavathy',
    imageUrl: '/src/assets/images/real/manapullikavu_bhagavathy.jpg',
    imageAuthor: 'Thiruvilla (Wikimedia Commons)',
    imageLicense: 'Public Domain',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Manapullykavu_Bhagawathy_temple.JPG',
    morningTiming: '5:30 AM – 12:00 PM',
    eveningTiming: '5:00 PM – 8:00 PM',
    windows: [
      { startMinutes: 5 * 60 + 30, endMinutes: 12 * 60, label: 'Morning Darshan' },
      { startMinutes: 17 * 60, endMinutes: 20 * 60, label: 'Evening Darshan' },
    ],
    heritageNote:
      'One of Palakkad’s most cherished Bhagavathy shrines, renowned for the vibrant Manapullikavu Vela festival, traditional Deepastambham, and serene laterite Nalambalam.',
    dressCode:
      'Traditional Kerala attire is required inside the inner temple courtyard (Mundu for men; Saree, Set Mundu, or traditional ethnic wear for women).',
    counterNote:
      'Collect your printed receipt slip and prasadam from the Main Nadappandal Devaswom Counter.',
    poojas: [
      {
        id: 'man-pushpanjali',
        name: 'Pushpanjali',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Devotional floral offering recited in the devotee’s name and birth star for the Goddess’s blessings.',
      },
      {
        id: 'man-neyvilakku',
        name: 'Neyvilakku',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Pure ghee lamp offering lit inside the sanctum corridor for prosperity and clarity.',
      },
      {
        id: 'man-raktha-pushpanjali',
        name: 'Raktha Pushpanjali',
        category: 'Archana',
        price: 50,
        slot: 'Morning & Evening',
        description:
          'Crimson hibiscus floral archana to Goddess Bhagavathy for courage, protection, and relief from hardships.',
      },
      {
        id: 'man-kadum-payasam',
        name: 'Kadum Payasam',
        category: 'Payasam/Nivedyam',
        price: 120,
        slot: 'Morning',
        description:
          'Rich jaggery, unakkalari rice, and ghee nivedyam prepared in the temple kitchen for family prosperity.',
      },
      {
        id: 'man-bhagavathy-seva',
        name: 'Bhagavathy Seva',
        category: 'Special Homam',
        price: 200,
        slot: 'Evening',
        description:
          'Sacred twilight worship centered around the decorated Kalamezhuthu lamp invoking Devi’s auspicious presence.',
      },
      {
        id: 'man-mangalya-pooja',
        name: 'Mangalya Pooja',
        category: 'Special Homam',
        price: 250,
        slot: 'Morning',
        description:
          'Traditional archana and turmeric-sindooram offering performed for marital harmony and timely alliances.',
      },
      {
        id: 'man-kalabhabhishekam',
        name: 'Kalabhabhishekam',
        category: 'Abhishekam',
        price: 300,
        slot: 'Morning',
        description:
          'Fragrant sandalwood paste abhishekam performed prior to Uchcha Pooja for cooling grace and serenity.',
      },
      {
        id: 'man-chuttuvilakku',
        name: 'Chuttuvilakku',
        category: 'Special Homam',
        price: 2500,
        slot: 'Evening',
        description:
          'Lighting of the full perimeter row of brass lamps across the Nalambalam during evening Athazha Pooja.',
      },
    ],
  },
  {
    id: 'emoor-hemambika',
    name: 'Sree Emoor Bhagavathy Temple (Hemambika Temple)',
    locality: 'Kallekulangara, Palakkad',
    deity: 'Goddess Hemambika',
    deityFilter: 'Bhagavathy',
    imageUrl: '/src/assets/images/real/emoor_sunset_alt.jpg',
    imageAuthor: 'P Radhika (Openverse / Flickr)',
    imageLicense: 'CC BY-SA 2.0',
    imageSourceUrl: 'https://www.flickr.com/photos/133812735@N04/52601967813',
    morningTiming: '5:30 AM – 11:30 AM',
    eveningTiming: '5:00 PM – 8:00 PM',
    windows: [
      { startMinutes: 5 * 60 + 30, endMinutes: 11 * 60 + 30, label: 'Morning Darshan' },
      { startMinutes: 17 * 60, endMinutes: 20 * 60, label: 'Evening Darshan' },
    ],
    heritageNote:
      'Set beside a tranquil granite temple kulam in Kallekulangara, Goddess Hemambika is uniquely worshipped in the form of sacred outstretched palms (Kai-Kaatti Devi).',
    dressCode:
      'Modest traditional attire required; men must remove upper garments before entering the inner Nalambalam.',
    counterNote:
      'Prasadam and Archana tokens are issued at the Kallekulangara East Mandapam Office.',
    poojas: [
      {
        id: 'emo-pushpanjali',
        name: 'Pushpanjali',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Daily flower offering chanted with the devotee’s birth star before Goddess Hemambika.',
      },
      {
        id: 'emo-neyvilakku',
        name: 'Neyvilakku',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Sacred cow-ghee lamp offering symbolizing devotion, auspiciousness, and inner peace.',
      },
      {
        id: 'emo-paal-payasam',
        name: 'Paal Payasam',
        category: 'Payasam/Nivedyam',
        price: 100,
        slot: 'Morning',
        description:
          'Classic temple milk payasam offered during Pantheeradi and Uchcha Pooja.',
      },
      {
        id: 'emo-ganapathy-homam',
        name: 'Ganapathy Homam',
        category: 'Special Homam',
        price: 150,
        slot: 'Morning',
        description:
          'Early-morning Vedic fire ritual removing obstacles and blessing academic or career pursuits.',
      },
      {
        id: 'emo-swayamvara-archana',
        name: 'Swayamvara Archana',
        category: 'Archana',
        price: 150,
        slot: 'Morning',
        description:
          'Auspicious Devi archana sought by families praying for harmonious marriage and domestic happiness.',
      },
      {
        id: 'emo-bhagavathy-seva',
        name: 'Bhagavathy Seva',
        category: 'Special Homam',
        price: 200,
        slot: 'Evening',
        description:
          'Traditional evening Devi pooja accompanied by Lalita Sahasranama and Deeparadhana.',
      },
      {
        id: 'emo-niramala',
        name: 'Niramala',
        category: 'Abhishekam',
        price: 500,
        slot: 'Morning',
        description:
          'Adorning the sanctum doorway and vigraham with abundant garlands of fresh jasmine, tulsi, and lotus.',
      },
    ],
  },
  {
    id: 'thiruvalathur-randu-moorthy',
    name: 'Thiruvalathur Randu Moorthy Temple',
    locality: 'Kodumbu, Palakkad',
    deity: 'Mahishasuramardini & Annapoorneswari',
    deityFilter: 'Bhagavathy',
    imageUrl: '/src/assets/images/real/thiruvalathur_1900.jpg',
    imageAuthor: 'British Library Archive (1900)',
    imageLicense: 'Public Domain',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:%E0%B4%A4%E0%B4%BF%E0%B4%B0%E0%B5%81%E0%B4%B5%E0%B4%B3%E0%B4%A4%E0%B5%8D%E0%B4%A4%E0%B5%82%E0%B5%BC_%E0%B4%AD%E0%B4%97%E0%B4%B5%E0%B4%A4%E0%B4%BF_%E0%B4%95%E0%B5%8D%E0%B4%B7%E0%B5%87%E0%B4%A4%E0%B5%8D%E0%B4%B0%E0%B4%82,_%E0%B4%AA%E0%B4%BE%E0%B4%B2%E0%B4%95%E0%B5%8D%E0%B4%95%E0%B4%BE%E0%B4%9F%E0%B5%8D_(1900).jpg',
    morningTiming: '6:00 AM – 10:30 AM',
    eveningTiming: '5:00 PM – 7:30 PM',
    windows: [
      { startMinutes: 6 * 60, endMinutes: 10 * 60 + 30, label: 'Morning Darshan' },
      { startMinutes: 17 * 60, endMinutes: 19 * 60 + 30, label: 'Evening Darshan' },
    ],
    heritageNote:
      'Celebrated across Kerala for its extraordinary 1,000-year-old granite wood-like carvings and dual sanctums housing Mahishasuramardini and Annapoorneswari.',
    dressCode:
      'Traditional Kerala attire strongly encouraged (Mundu / Kasavu Saree); photography is prohibited inside the Nalambalam.',
    counterNote:
      'Show your Booking QR at the Kodumbu West Gate Devaswom Counter to collect Prasadam.',
    poojas: [
      {
        id: 'thi-pushpanjali',
        name: 'Pushpanjali',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Sacred floral archana offered to both Mahishasuramardini and Annapoorneswari.',
      },
      {
        id: 'thi-neyvilakku',
        name: 'Neyvilakku',
        category: 'Archana',
        price: 20,
        slot: 'Morning & Evening',
        description:
          'Pure ghee lamp offering lit inside the ancient granite pillared courtyard.',
      },
      {
        id: 'thi-paal-payasam',
        name: 'Paal Payasam',
        category: 'Payasam/Nivedyam',
        price: 100,
        slot: 'Morning',
        description:
          'Sweet milk payasam offered to Annapoorneswari Devi for abundance and nourishment.',
      },
      {
        id: 'thi-ksheerabhishekam',
        name: 'Ksheerabhishekam',
        category: 'Abhishekam',
        price: 120,
        slot: 'Morning',
        description:
          'Sacred milk abhishekam bringing peace of mind, health, and family prosperity.',
      },
      {
        id: 'thi-mangalya-pooja',
        name: 'Mangalya Pooja',
        category: 'Special Homam',
        price: 250,
        slot: 'Morning',
        description:
          'Dedicated Devi pooja for marital harmony, family grace, and auspicious milestones.',
      },
      {
        id: 'thi-annadana-nivedyam',
        name: 'Annadana Nivedyam',
        category: 'Payasam/Nivedyam',
        price: 300,
        slot: 'Morning',
        description:
          'Contribution toward sacred temple Annadanam offered before Goddess Annapoorneswari.',
      },
      {
        id: 'thi-chandi-homam',
        name: 'Chandi Homam Sankalpam',
        category: 'Special Homam',
        price: 600,
        slot: 'Morning',
        description:
          'Powerful Devi homam sankalpam before Mahishasuramardini for courage and protection.',
      },
    ],
  },
];

export interface TempleLiveStatus {
  isOpen: boolean;
  statusText: string;
  subText: string;
}

export function getTempleLiveStatus(temple: Temple, now: Date = new Date()): TempleLiveStatus {
  const istParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(now);

  const hourStr = istParts.find((p) => p.type === 'hour')?.value ?? '0';
  const minStr = istParts.find((p) => p.type === 'minute')?.value ?? '0';
  const currentMinutes = (Number(hourStr) % 24) * 60 + Number(minStr);

  for (const w of temple.windows) {
    if (currentMinutes >= w.startMinutes && currentMinutes <= w.endMinutes) {
      const endHour = Math.floor(w.endMinutes / 60);
      const endMin = w.endMinutes % 60;
      const ampm = endHour >= 12 ? 'PM' : 'AM';
      const displayHour = endHour % 12 === 0 ? 12 : endHour % 12;
      const formattedEnd = `${displayHour}:${String(endMin).padStart(2, '0')} ${ampm}`;
      return {
        isOpen: true,
        statusText: 'Open Now',
        subText: `${w.label} until ${formattedEnd}`,
      };
    }
  }

  // Determine next opening window
  const sorted = [...temple.windows].sort((a, b) => a.startMinutes - b.startMinutes);
  const nextWindow =
    sorted.find((w) => w.startMinutes > currentMinutes) ?? sorted[0];
  const startHour = Math.floor(nextWindow.startMinutes / 60);
  const startMin = nextWindow.startMinutes % 60;
  const ampm = startHour >= 12 ? 'PM' : 'AM';
  const displayHour = startHour % 12 === 0 ? 12 : startHour % 12;
  const formattedStart = `${displayHour}:${String(startMin).padStart(2, '0')} ${ampm}`;

  return {
    isOpen: false,
    statusText: 'Closed',
    subText: `Opens ${formattedStart}`,
  };
}

export function getTomorrowDateISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatPoojaDateDisplay(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Returns the earliest pooja date (YYYY-MM-DD) across booking items and
 * computes the cancellation cutoff: 00:00:00 IST on that pooja date
 * (i.e. 11:59:59 PM IST on the previous day of the event).
 */
export function getEarliestPoojaDateISO(items: { poojaDate: string }[]): string {
  const dates = items
    .map((i) => i.poojaDate)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  return dates[0] || getTomorrowDateISO();
}

export function computeCancellationDeadline(items: { poojaDate: string }[]): Date {
  const earliest = getEarliestPoojaDateISO(items);
  // 00:00:00 IST on the event date = end of the previous day
  return new Date(`${earliest}T00:00:00+05:30`);
}

export function getPreviousDayLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return dt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export interface CancellationEligibility {
  eligible: boolean;
  isCancelled: boolean;
  isPastDeadline: boolean;
  deadlineLabel: string;
  earliestDateLabel: string;
  reason: string;
}

export function getCancellationEligibility(
  booking: {
    bookingStatus?: 'CONFIRMED' | 'CANCELLED';
    cancellationDeadline?: unknown;
    items: { poojaDate: string }[];
  },
  isAdmin: boolean,
  now: Date = new Date()
): CancellationEligibility {
  const earliestISO = getEarliestPoojaDateISO(booking.items);
  const earliestDateLabel = formatPoojaDateDisplay(earliestISO);
  const prevDay = getPreviousDayLabel(earliestISO);
  const deadlineLabel = `${prevDay}, 11:59 PM IST`;

  if (booking.bookingStatus === 'CANCELLED') {
    return {
      eligible: false,
      isCancelled: true,
      isPastDeadline: false,
      deadlineLabel,
      earliestDateLabel,
      reason: 'This Vazhipadu booking has been cancelled.',
    };
  }

  let deadlineDate: Date;
  const raw = booking.cancellationDeadline;
  if (raw instanceof Date) {
    deadlineDate = raw;
  } else if (
    raw &&
    typeof (raw as { toDate?: () => Date }).toDate === 'function'
  ) {
    deadlineDate = (raw as { toDate: () => Date }).toDate();
  } else {
    deadlineDate = computeCancellationDeadline(booking.items);
  }

  const isPastDeadline = now.getTime() > deadlineDate.getTime();

  if (isAdmin) {
    return {
      eligible: true,
      isCancelled: false,
      isPastDeadline,
      deadlineLabel,
      earliestDateLabel,
      reason: isPastDeadline
        ? 'Past devotee cutoff · Admin cancellation override available.'
        : `Open for cancellation until ${deadlineLabel}.`,
    };
  }

  if (isPastDeadline) {
    return {
      eligible: false,
      isCancelled: false,
      isPastDeadline: true,
      deadlineLabel,
      earliestDateLabel,
      reason: `Cancellation window closed on ${deadlineLabel} (minimum previous day required).`,
    };
  }

  return {
    eligible: true,
    isCancelled: false,
    isPastDeadline: false,
    deadlineLabel,
    earliestDateLabel,
    reason: `Free cancellation open until ${deadlineLabel}.`,
  };
}

