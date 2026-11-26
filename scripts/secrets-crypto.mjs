#!/usr/bin/env node
/**
 * Encrypts and decrypts local sensitive configuration files (.env, .env.local,
 * firebase-applet-config.json) using AES-256-GCM with scrypt key derivation.
 *
 * Usage:
 *   npm run secrets:encrypt
 *   npm run secrets:decrypt
 *
 * Optionally pass passphrase via SECRETS_PASSPHRASE environment variable in CI.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const ROOT = process.cwd();
const ARCHIVE_PATH = path.join(ROOT, '.secrets.enc.json');
const TARGET_FILES = ['.env', '.env.local', 'firebase-applet-config.json'];

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 32;

function promptHidden(question) {
  if (process.env.SECRETS_PASSPHRASE) {
    return Promise.resolve(process.env.SECRETS_PASSPHRASE);
  }
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const origWrite = rl._writeToOutput;
    rl._writeToOutput = function (str) {
      if (rl.stdoutMuted) return;
      origWrite.call(rl, str);
    };
    rl.stdoutMuted = false;
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    rl.stdoutMuted = true;
  });
}

function encryptFiles(passphrase) {
  if (!passphrase || passphrase.length < 8) {
    console.error('Error: Passphrase must be at least 8 characters.');
    process.exit(1);
  }

  const bundle = {};
  for (const relPath of TARGET_FILES) {
    const absPath = path.join(ROOT, relPath);
    if (fs.existsSync(absPath)) {
      bundle[relPath] = fs.readFileSync(absPath, 'utf8');
    }
  }

  const fileNames = Object.keys(bundle);
  if (fileNames.length === 0) {
    console.error('No sensitive config files found to encrypt.');
    process.exit(1);
  }

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(passphrase, salt, KEY_LEN, SCRYPT_PARAMS);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from('vazhipadubook-secrets-v1', 'utf8'));

  const plaintext = Buffer.from(JSON.stringify(bundle), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = {
    version: 1,
    algorithm: 'aes-256-gcm',
    kdf: 'scrypt',
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: encrypted.toString('base64'),
  };

  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(payload, null, 2) + '\n', {
    mode: 0o600,
  });

  console.log(
    `Encrypted ${fileNames.length} file(s) (${fileNames.join(', ')}) -> .secrets.enc.json`
  );
}

function decryptFiles(passphrase) {
  if (!fs.existsSync(ARCHIVE_PATH)) {
    console.error('Error: .secrets.enc.json not found.');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf8'));
  if (payload.version !== 1 || payload.algorithm !== 'aes-256-gcm') {
    console.error('Error: Unsupported encrypted archive format.');
    process.exit(1);
  }

  const salt = Buffer.from(payload.salt, 'base64');
  const iv = Buffer.from(payload.iv, 'base64');
  const authTag = Buffer.from(payload.authTag, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');

  const key = crypto.scryptSync(passphrase, salt, KEY_LEN, SCRYPT_PARAMS);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAAD(Buffer.from('vazhipadubook-secrets-v1', 'utf8'));
  decipher.setAuthTag(authTag);

  let bundle;
  try {
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    bundle = JSON.parse(decrypted.toString('utf8'));
  } catch {
    console.error('Decryption failed: invalid passphrase or tampered archive.');
    process.exit(1);
  }

  const restored = [];
  for (const [relPath, content] of Object.entries(bundle)) {
    if (!TARGET_FILES.includes(relPath)) continue;
    const absPath = path.resolve(ROOT, relPath);
    if (!absPath.startsWith(ROOT + path.sep)) continue;
    fs.writeFileSync(absPath, String(content), { mode: 0o600 });
    restored.push(relPath);
  }

  console.log(`Restored ${restored.length} file(s): ${restored.join(', ')}`);
}

async function main() {
  const cmd = process.argv[2];
  if (cmd !== 'encrypt' && cmd !== 'decrypt') {
    console.error('Usage: node scripts/secrets-crypto.mjs <encrypt|decrypt>');
    process.exit(1);
  }

  const passphrase = await promptHidden(
    cmd === 'encrypt'
      ? 'Enter encryption passphrase (min 8 chars): '
      : 'Enter decryption passphrase: '
  );

  if (cmd === 'encrypt') {
    encryptFiles(passphrase);
  } else {
    decryptFiles(passphrase);
  }
}

void main();
