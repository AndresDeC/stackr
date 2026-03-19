import fs from 'fs';
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
  try {
    if (!fs.existsSync(PREFS_DIR)) {
      fs.mkdirSync(PREFS_DIR, { recursive: true });
    }
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