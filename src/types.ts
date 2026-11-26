export type PoojaCategory =
  | 'Archana'
  | 'Abhishekam'
  | 'Payasam/Nivedyam'
  | 'Special Homam';

export type DiscoveryFilter =
  | 'All'
  | 'Bhagavathy'
  | 'Shiva'
  | 'Homam'
  | 'Nivedyam';

export interface Pooja {
  id: string;
  name: string;
  category: PoojaCategory;
  price: number;
  slot: 'Morning' | 'Evening' | 'Morning & Evening';
  description: string;
}

export interface DarshanWindow {
  startMinutes: number; // minutes since midnight IST
  endMinutes: number;
  label: string;
}

export interface Temple {
  id: string;
  name: string;
  locality: string;
  deity: string;
  deityFilter: 'Bhagavathy' | 'Shiva';
  imageUrl: string;
  imageAuthor: string;
  imageLicense: string;
  imageSourceUrl: string;
  morningTiming: string;
  eveningTiming: string;
  windows: DarshanWindow[];
  heritageNote: string;
  dressCode: string;
  counterNote: string;
  poojas: Pooja[];
}

export interface CartItem {
  cartItemId: string;
  templeId: string;
  templeName: string;
  poojaId: string;
  poojaName: string;
  category: PoojaCategory;
  unitPrice: number;
  quantity: number;
  devoteeName: string;
  nakshatra: string;
  poojaDate: string;
  slot: string;
}

export type PrasadamDeliveryMode = 'Counter Pickup' | 'Speed Post';
export type PaymentMethod = 'UPI' | 'Credit/Debit Card' | 'NetBanking';

export interface BookingItem {
  poojaName: string;
  category: string;
  devoteeName: string;
  nakshatra: string;
  poojaDate: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BookingRecord {
  bookingId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  templeId: string;
  templeName: string;
  items: BookingItem[];
  prasadamDelivery: PrasadamDeliveryMode;
  deliveryAddress: string;
  subtotalAmount: number;
  convenienceFee: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentStatus: 'SUCCESS';
  bookingStatus?: 'CONFIRMED' | 'CANCELLED';
  cancellationDeadline?: unknown;
  cancelledAt?: unknown;
  cancelledAtMillis?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  createdAt?: unknown;
  createdAtMillis?: number;
  deviceType: 'Mobile' | 'Desktop';
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

export type ActiveView = 'explore' | 'temple' | 'bookings' | 'admin';
