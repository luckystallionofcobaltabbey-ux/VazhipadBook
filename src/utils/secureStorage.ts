/**
 * Client-side AES-256-GCM encrypted browser storage using Web Crypto API.
 * Uses a non-extractable CryptoKey persisted in IndexedDB so sensitive
 * devotee details, phone numbers, and postal addresses are never stored
 * in plaintext inside localStorage.
 */

const DB_NAME = 'vazhipadubook_keystore';
const STORE_NAME = 'keys';
const KEY_ID = 'local_aes_gcm_v1';

interface EncryptedEnvelope {
  v: 1;
  iv: string;
  ct: string;
}

function isCryptoAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.crypto?.subtle) &&
    typeof window.indexedDB !== 'undefined'
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function toUint8Array(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const buf = new ArrayBuffer(bytes.byteLength);
  const view = new Uint8Array(buf);
  view.set(bytes);
  return view;
}

function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function openKeyStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getOrCreateDeviceKey(): Promise<CryptoKey> {
  const db = await openKeyStore();
  try {
    const existing = await new Promise<CryptoKey | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_ID);
      req.onsuccess = () => resolve(req.result as CryptoKey | undefined);
      req.onerror = () => reject(req.error);
    });

    if (existing) {
      return existing;
    }

    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false, // Non-extractable key
      ['encrypt', 'decrypt']
    );

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(key, KEY_ID);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return key;
  } finally {
    db.close();
  }
}

function buildAad(storageKey: string, contextId?: string): Uint8Array<ArrayBuffer> {
  return toUint8Array(
    new TextEncoder().encode(`${storageKey}::${contextId || 'anon'}`)
  );
}

export async function setEncryptedItem<T>(
  storageKey: string,
  value: T,
  contextId?: string
): Promise<void> {
  if (!isCryptoAvailable() || typeof window.localStorage === 'undefined') {
    return;
  }

  try {
    const key = await getOrCreateDeviceKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(new ArrayBuffer(12)));
    const plaintext = toUint8Array(
      new TextEncoder().encode(JSON.stringify(value))
    );
    const additionalData = buildAad(storageKey, contextId);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData,
      },
      key,
      plaintext
    );

    const envelope: EncryptedEnvelope = {
      v: 1,
      iv: toBase64(iv),
      ct: toBase64(new Uint8Array(ciphertext)),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(envelope));
  } catch {
    // Fail closed: never fall back to plaintext PII storage
  }
}

export async function getEncryptedItem<T>(
  storageKey: string,
  contextId?: string
): Promise<T | null> {
  if (!isCryptoAvailable() || typeof window.localStorage === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const envelope = JSON.parse(raw) as Partial<EncryptedEnvelope>;
    if (envelope?.v !== 1 || !envelope.iv || !envelope.ct) {
      return null;
    }

    const key = await getOrCreateDeviceKey();
    const iv = fromBase64(envelope.iv);
    const ct = fromBase64(envelope.ct);
    const additionalData = buildAad(storageKey, contextId);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData,
      },
      key,
      ct
    );

    const json = new TextDecoder().decode(decrypted);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function removeEncryptedItem(storageKey: string): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Ignore storage access errors
  }
}
