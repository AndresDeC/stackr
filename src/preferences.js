import fs from 'fs';
import path from 'path';
import os from 'os';

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

export function formatStackSummary(prefs) {
  if (!prefs) return null;
  const parts = [prefs.framework];
  if (prefs.database && prefs.database !== 'none') parts.push(prefs.database);
  if (prefs.auth && prefs.auth !== 'none') parts.push(prefs.auth);
  if (prefs.testing && prefs.testing !== 'none') parts.push(prefs.testing);
  return parts.join(' + ');
}
