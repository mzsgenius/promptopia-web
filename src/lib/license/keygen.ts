// License key generation & verification
// Must match the algorithm in desktop-app/main.js

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const GROUP_SIZE = 5;
const GROUP_COUNT = 4;

export function generateLicenseKey(): string {
  while (true) {
    // Generate 20 random chars
    let raw = '';
    for (let i = 0; i < GROUP_SIZE * GROUP_COUNT; i++) {
      raw += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    // Checksum: first * last % 256 === 165 (0xA5) or 90
    const first = raw.charCodeAt(0);
    const last = raw.charCodeAt(raw.length - 1);
    const checksum = (first * last) % 256;
    if (checksum !== 165 && checksum !== 90) continue;

    // Rolling hash: Math.abs(hash) % 7 === 0
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash = hash & hash; // convert to 32-bit int
    }
    if (Math.abs(hash) % 7 !== 0) continue;

    // Format as XXXX-XXXXX-XXXXX-XXXXX
    const groups: string[] = [];
    for (let i = 0; i < GROUP_COUNT; i++) {
      groups.push(raw.slice(i * GROUP_SIZE, (i + 1) * GROUP_SIZE));
    }
    return groups.join('-');
  }
}

export function verifyLicenseKey(key: string): boolean {
  if (!key || key.length < 10) return false;

  const trimmed = key.trim().toUpperCase();
  const clean = trimmed.replace(/-/g, '');
  if (clean.length < 16) return false;

  const first = clean.charCodeAt(0);
  const last = clean.charCodeAt(clean.length - 1);
  const checksum = (first * last) % 256;
  if (checksum !== 165 && checksum !== 90) return false;

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % 7 === 0;
}
