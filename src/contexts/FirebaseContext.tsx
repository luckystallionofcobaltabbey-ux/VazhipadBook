import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { computeCancellationDeadline, getCancellationEligibility } from '../data/temples';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
} from '../firebaseConfig';
import {
  getEncryptedItem,
  removeEncryptedItem,
  setEncryptedItem,
} from '../utils/secureStorage';
import type {
  BookingItem,
  BookingRecord,
  CartItem,
  PaymentMethod,
  PrasadamDeliveryMode,
  UserProfile,
} from '../types';

export const ADMIN_EMAIL = (
  import.meta.env.VITE_ADMIN_EMAIL || 'luckystallionofcobaltabbey@gmail.com'
).toLowerCase();
const ENCRYPTED_BOOKINGS_KEY = 'vb_bookings_cache_v1';

interface CreateBookingInput {
  templeId: string;
  templeName: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  prasadamDelivery: PrasadamDeliveryMode;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
}

interface FirebaseContextValue {
  currentUser: User | null;
  userProfile: UserProfile | null;
  authReady: boolean;
  isAdmin: boolean;
  bookings: BookingRecord[];
  bookingsLoading: boolean;
  bookingsError: string | null;
  adminBookings: BookingRecord[];
  adminBookingsLoading: boolean;
  adminBookingsError: string | null;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  updateCustomerPhone: (phone: string) => Promise<void>;
  createBooking: (input: CreateBookingInput) => Promise<BookingRecord>;
  cancelBooking: (booking: BookingRecord, reason: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

function sanitizeStr(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

function generateBookingId(): string {
  const year = new Date().getFullYear();
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PKD-${year}-${digits}`;
}

function generateTransactionId(method: PaymentMethod): string {
  const rand = Math.floor(100000000 + Math.random() * 900000000);
  if (method === 'UPI') return `UPI-${rand}`;
  if (method === 'Credit/Debit Card') return `CARD-${rand}`;
  return `NB-${rand}`;
}

function mapBookingDoc(data: BookingRecord): BookingRecord {
  let createdMillis = Date.now();
  if (data.createdAt instanceof Timestamp) {
    createdMillis = data.createdAt.toMillis();
  } else if (
    data.createdAt &&
    typeof (data.createdAt as { toMillis?: () => number }).toMillis === 'function'
  ) {
    createdMillis = (data.createdAt as { toMillis: () => number }).toMillis();
  }

  let cancelledMillis: number | undefined;
  if (data.cancelledAt instanceof Timestamp) {
    cancelledMillis = data.cancelledAt.toMillis();
  } else if (
    data.cancelledAt &&
    typeof (data.cancelledAt as { toMillis?: () => number }).toMillis === 'function'
  ) {
    cancelledMillis = (data.cancelledAt as { toMillis: () => number }).toMillis();
  }

  return {
    ...data,
    bookingStatus: data.bookingStatus || 'CONFIRMED',
    createdAtMillis: createdMillis,
    cancelledAtMillis: cancelledMillis,
  };
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const [adminBookings, setAdminBookings] = useState<BookingRecord[]>([]);
  const [adminBookingsLoading, setAdminBookingsLoading] = useState(false);
  const [adminBookingsError, setAdminBookingsError] = useState<string | null>(null);

  const isAdmin = Boolean(
    currentUser &&
      currentUser.email?.toLowerCase() === ADMIN_EMAIL &&
      currentUser.emailVerified
  );

  const syncUserDocument = async (
    user: User,
    fallbackName?: string,
    phone?: string
  ): Promise<void> => {
    if (!isFirebaseConfigured) return;
    const path = `users/${user.uid}`;
    const userRef = doc(db, 'users', user.uid);

    const safeName = sanitizeStr(
      fallbackName || user.displayName || user.email?.split('@')[0] || 'Devotee',
      120
    );
    const safeEmail = sanitizeStr(user.email || 'devotee@vazhipadubook.in', 160);
    const safePhone = phone ? sanitizeStr(phone, 20) : undefined;

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newProfile: Record<string, unknown> = {
          uid: user.uid,
          name: safeName,
          email: safeEmail,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        if (safePhone !== undefined && safePhone.length > 0) {
          newProfile.phone = safePhone;
        }
        await setDoc(userRef, newProfile);
        setUserProfile({
          uid: user.uid,
          name: safeName,
          email: safeEmail,
          phone: safePhone,
        });
      } else {
        const existingData = snap.data() as UserProfile;
        const updates: Record<string, unknown> = {
          name: existingData.name || safeName,
          email: safeEmail,
          lastLoginAt: serverTimestamp(),
        };
        if (safePhone !== undefined && safePhone.length > 0) {
          updates.phone = safePhone;
        }
        await updateDoc(userRef, updates);
        setUserProfile({
          uid: user.uid,
          name: (updates.name as string) || safeName,
          email: safeEmail,
          phone: (updates.phone as string) || existingData.phone,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        getDoc(userRef)
          .then((snap) => {
            if (snap.exists()) {
              setUserProfile(snap.data() as UserProfile);
            } else {
              void syncUserDocument(user);
            }
          })
          .catch((error) => {
            console.error('Error loading user profile:', error);
          });
      } else {
        setUserProfile(null);
        setBookings([]);
        setAdminBookings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore listener for authenticated user's bookings
  useEffect(() => {
    if (!isFirebaseConfigured || !authReady || !currentUser) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    let cancelled = false;
    setBookingsLoading(true);
    setBookingsError(null);

    // Hydrate AES-256-GCM encrypted offline cache bound to this user UID
    void getEncryptedItem<BookingRecord[]>(
      ENCRYPTED_BOOKINGS_KEY,
      currentUser.uid
    ).then((cached) => {
      if (!cancelled && cached && cached.length > 0) {
        setBookings((prev) => (prev.length === 0 ? cached : prev));
      }
    });

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((d) =>
          mapBookingDoc(d.data() as BookingRecord)
        );
        list.sort((a, b) => (b.createdAtMillis ?? 0) - (a.createdAtMillis ?? 0));
        setBookings(list);
        setBookingsLoading(false);
        void setEncryptedItem(ENCRYPTED_BOOKINGS_KEY, list, currentUser.uid);
      },
      (error) => {
        setBookingsLoading(false);
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setBookingsError(
            'Offline — showing encrypted locally cached bookings.'
          );
          return;
        }
        setBookingsError('Unable to load cloud bookings.');
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [authReady, currentUser]);

  // Real-time Firestore listener for Admin (all bookings)
  useEffect(() => {
    if (!isFirebaseConfigured || !authReady || !currentUser || !isAdmin) {
      setAdminBookings([]);
      setAdminBookingsLoading(false);
      return;
    }

    setAdminBookingsLoading(true);
    setAdminBookingsError(null);

    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const list = snapshot.docs.map((d) =>
          mapBookingDoc(d.data() as BookingRecord)
        );
        list.sort((a, b) => (b.createdAtMillis ?? 0) - (a.createdAtMillis ?? 0));
        setAdminBookings(list);
        setAdminBookingsLoading(false);
      },
      (error) => {
        setAdminBookingsLoading(false);
        setAdminBookingsError('Unable to load admin bookings.');
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    return () => unsubscribe();
  }, [authReady, currentUser, isAdmin]);

  const signInWithGoogle = async (): Promise<User> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase credentials are not configured yet.');
    }
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserDocument(result.user);
    return result.user;
  };

  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase credentials are not configured yet.');
    }
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    await syncUserDocument(result.user);
    return result.user;
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase credentials are not configured yet.');
    }
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const cleanName = sanitizeStr(name, 120);
    if (cleanName) {
      await updateProfile(result.user, { displayName: cleanName });
    }
    await syncUserDocument(result.user, cleanName, phone);
    return result.user;
  };

  const logout = async (): Promise<void> => {
    removeEncryptedItem(ENCRYPTED_BOOKINGS_KEY);
    if (!isFirebaseConfigured) return;
    await signOut(auth);
  };

  const updateCustomerPhone = async (phone: string): Promise<void> => {
    if (!isFirebaseConfigured || !currentUser) return;
    const cleanPhone = sanitizeStr(phone, 20);
    if (!cleanPhone) return;
    const path = `users/${currentUser.uid}`;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        phone: cleanPhone,
        lastLoginAt: serverTimestamp(),
      });
      setUserProfile((prev) =>
        prev ? { ...prev, phone: cleanPhone } : prev
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const createBooking = async (
    input: CreateBookingInput
  ): Promise<BookingRecord> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }
    if (!currentUser) {
      throw new Error('Authentication required to complete booking.');
    }

    const bookingId = generateBookingId();
    const transactionId = generateTransactionId(input.paymentMethod);

    const boundedItems: BookingItem[] = input.items.slice(0, 25).map((item) => {
      const unitPrice = Math.max(1, Math.round(item.unitPrice));
      const quantity = Math.min(50, Math.max(1, Math.round(item.quantity)));
      return {
        poojaName: sanitizeStr(item.poojaName, 120),
        category: sanitizeStr(item.category, 60),
        devoteeName: sanitizeStr(item.devoteeName, 120),
        nakshatra: sanitizeStr(item.nakshatra, 40),
        poojaDate: sanitizeStr(item.poojaDate, 20),
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
      };
    });

    const subtotalAmount = boundedItems.reduce((sum, i) => sum + i.subtotal, 0);
    const convenienceFee = 5;
    const deliveryFee = input.prasadamDelivery === 'Speed Post' ? 50 : 0;
    const totalAmount = subtotalAmount + convenienceFee + deliveryFee;

    const deviceType: 'Mobile' | 'Desktop' =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))
        ? 'Mobile'
        : 'Desktop';

    const cancellationDeadline = Timestamp.fromDate(
      computeCancellationDeadline(boundedItems)
    );

    const payload = {
      bookingId,
      userId: currentUser.uid,
      customerName: sanitizeStr(input.customerName, 120),
      customerEmail: sanitizeStr(input.customerEmail, 160),
      customerPhone: sanitizeStr(input.customerPhone, 20),
      templeId: sanitizeStr(input.templeId, 80),
      templeName: sanitizeStr(input.templeName, 160),
      items: boundedItems,
      prasadamDelivery: input.prasadamDelivery,
      deliveryAddress:
        input.prasadamDelivery === 'Speed Post'
          ? sanitizeStr(input.deliveryAddress, 400)
          : '',
      subtotalAmount,
      convenienceFee,
      deliveryFee,
      totalAmount,
      paymentMethod: input.paymentMethod,
      transactionId,
      paymentStatus: 'SUCCESS' as const,
      bookingStatus: 'CONFIRMED' as const,
      cancellationDeadline,
      createdAt: serverTimestamp(),
      deviceType,
    };

    const path = `bookings/${bookingId}`;
    try {
      await setDoc(doc(db, 'bookings', bookingId), payload);
      void updateCustomerPhone(input.customerPhone);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }

    return {
      ...payload,
      createdAtMillis: Date.now(),
    };
  };

  const cancelBooking = async (
    booking: BookingRecord,
    reason: string
  ): Promise<void> => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured.');
    }
    if (!currentUser) {
      throw new Error('Authentication required to cancel booking.');
    }
    if (booking.userId !== currentUser.uid) {
      throw new Error('Only the booking owner can cancel this Vazhipadu.');
    }

    const eligibility = getCancellationEligibility(booking);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason);
    }

    const cleanReason = sanitizeStr(
      reason || 'Cancelled prior to pooja date',
      240
    );
    const cleanActor = sanitizeStr(
      currentUser.email || currentUser.uid,
      160
    );

    const path = `bookings/${booking.bookingId}`;
    try {
      await updateDoc(doc(db, 'bookings', booking.bookingId), {
        bookingStatus: 'CANCELLED',
        cancelledAt: serverTimestamp(),
        cancellationReason: cleanReason,
        cancelledBy: cleanActor,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        userProfile,
        authReady,
        isAdmin,
        bookings,
        bookingsLoading,
        bookingsError,
        adminBookings,
        adminBookingsLoading,
        adminBookingsError,
        isConfigured: isFirebaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateCustomerPhone,
        createBooking,
        cancelBooking,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return ctx;
}
