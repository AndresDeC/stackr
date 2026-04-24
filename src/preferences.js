import fs from 'fs';
<<<<<<< HEAD
import os from 'os';
import path from 'path';
 
const PREFS_DIR = path.join(os.homedir(), '.stackr');
const PREFS_FILE = path.join(PREFS_DIR, 'config.json');
 
export function loadPreferences() {
  try {
    if (!fs.existsSync(PREFS_FILE)) return null;
    const raw = fs.readFileSync(PREFS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
 
export function savePreferences(prefs) {
=======
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
>>>>>>> dadcffd (Commit stackr ultimate)
  try {
    if (!fs.existsSync(PREFS_DIR)) {
      fs.mkdirSync(PREFS_DIR, { recursive: true });
    }
<<<<<<< HEAD
    fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
  } catch (err) {
    console.error('Could not save preferences:', err.message);
  }
}
 
export function saveLicense(licenseKey) {
  const prefs = loadPreferences() || {};
  prefs.licenseKey = licenseKey;
  savePreferences(prefs);
}
 
export function loadLicense() {
  const prefs = loadPreferences();
  return prefs?.licenseKey || null;
}
 
const LABELS = {
  // Frameworks
  nextjs: 'Next.js',
  'express-api': 'Express API',
  'node-cli': 'Node.js CLI',
  fastapi: 'FastAPI',
  flask: 'Flask',
  django: 'Django',
  'rust-axum': 'Rust + Axum',
  'rust-cli': 'Rust CLI',
  cpp: 'C++',
  c: 'C',
  // Databases
  'prisma-postgres': 'Prisma + PostgreSQL',
  'prisma-sqlite': 'Prisma + SQLite',
  mongoose: 'Mongoose',
  'sqlalchemy-postgres': 'SQLAlchemy + PostgreSQL',
  'sqlalchemy-sqlite': 'SQLAlchemy + SQLite',
  // Auth
  authjs: 'Auth.js',
  jwt: 'JWT',
  // Testing
  vitest: 'Vitest',
  jest: 'Jest',
};
 
const label = (val) => LABELS[val] || val;
 
export function formatStackSummary(prefs) {
  if (!prefs) return null;
  const parts = [label(prefs.framework)];
  if (prefs.database && prefs.database !== 'none') parts.push(label(prefs.database));
  if (prefs.auth && prefs.auth !== 'none') parts.push(label(prefs.auth));
  if (prefs.testing && prefs.testing !== 'none') parts.push(label(prefs.testing));
  return parts.join(' + ');
}
=======
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
>>>>>>> dadcffd (Commit stackr ultimate)
