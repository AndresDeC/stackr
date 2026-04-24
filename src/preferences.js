import fs from 'fs';
import path from 'path';
import os from 'os';

const PREFS_DIR = path.join(os.homedir(), '.stackr');
const PROFILES_FILE = path.join(PREFS_DIR, 'profiles.json');

// ─── Profiles ────────────────────────────────────────────────────────────────
// Structure: { profiles: { profileName: { framework, database, auth, testing, extras, versions } } }

export function loadProfiles() {
  try {
    if (!fs.existsSync(PROFILES_FILE)) return {};
    const raw = fs.readFileSync(PROFILES_FILE, 'utf-8');
    return JSON.parse(raw).profiles || {};
  } catch {
    return {};
  }
}

export function saveProfile(name, stack) {
  try {
    if (!fs.existsSync(PREFS_DIR)) {
      fs.mkdirSync(PREFS_DIR, { recursive: true });
    }
    const data = fs.existsSync(PROFILES_FILE)
      ? JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'))
      : { profiles: {} };

    data.profiles[name] = stack;
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Could not save profile:', err.message);
  }
}

export function deleteProfile(name) {
  try {
    if (!fs.existsSync(PROFILES_FILE)) return;
    const data = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf-8'));
    delete data.profiles[name];
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Could not delete profile:', err.message);
  }
}

export function getProfileNames() {
  const profiles = loadProfiles();
  return Object.keys(profiles);
}

// ─── Labels ──────────────────────────────────────────────────────────────────
const LABELS = {
  nextjs: 'Next.js',
  'vite-react': 'Vite + React',
  'vite-vue': 'Vite + Vue',
  astro: 'Astro',
  sveltekit: 'SvelteKit',
  'express-api': 'Express API',
  fastify: 'Fastify',
  hono: 'Hono',
  'node-cli': 'Node.js CLI',
  'prisma-postgres': 'Prisma + PostgreSQL',
  'prisma-sqlite': 'Prisma + SQLite',
  mongoose: 'Mongoose',
  authjs: 'Auth.js',
  jwt: 'JWT',
  vitest: 'Vitest',
  jest: 'Jest',
};

const label = (val) => LABELS[val] || val;

export function formatStackSummary(stack) {
  if (!stack) return null;
  const parts = [label(stack.framework)];
  if (stack.database && stack.database !== 'none') parts.push(label(stack.database));
  if (stack.auth && stack.auth !== 'none') parts.push(label(stack.auth));
  if (stack.testing && stack.testing !== 'none') parts.push(label(stack.testing));
  return parts.join(' + ');
}
