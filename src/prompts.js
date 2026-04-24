import { input, select, checkbox, confirm } from '@inquirer/prompts';
import { loadProfiles, formatStackSummary, deleteProfile } from './preferences.js';
import { KNOWN_VERSIONS } from './versions.js';

export async function askProjectName() {
  return input({
    message: 'Project name:',
    default: 'my-app',
    validate: (v) => v.trim().length > 0 || 'Project name cannot be empty',
  });
}

// ─── Profile selection ───────────────────────────────────────────────────────
export async function askProfileMode() {
  const profiles = loadProfiles();
  const profileNames = Object.keys(profiles);

  if (profileNames.length === 0) return { mode: 'new', profile: null };

  const choices = [
    ...profileNames.map((name) => ({
      name: `${name}  (${formatStackSummary(profiles[name])})`,
      value: { mode: 'use', profileName: name },
    })),
    { name: '+ New profile', value: { mode: 'new', profileName: null } },
    { name: '✎ Manage profiles', value: { mode: 'manage', profileName: null } },
  ];

  const result = await select({
    message: 'Stack setup:',
    choices,
  });

  return result;
}

export async function askProfileName(existing = []) {
  return input({
    message: 'Profile name (e.g. frontend1, backend-api, saas):',
    default: `profile${existing.length + 1}`,
    validate: (v) => {
      if (!v.trim()) return 'Name cannot be empty';
      if (existing.includes(v.trim())) return `Profile "${v}" already exists`;
      return true;
    },
  });
}

export async function askManageProfiles() {
  const profiles = loadProfiles();
  const profileNames = Object.keys(profiles);

  if (profileNames.length === 0) {
    return { action: 'back' };
  }

  const action = await select({
    message: 'Manage profiles:',
    choices: [
      { name: 'Delete a profile', value: 'delete' },
      { name: '← Back', value: 'back' },
    ],
  });

  if (action === 'delete') {
    const toDelete = await select({
      message: 'Which profile to delete?',
      choices: profileNames.map((n) => ({ name: `${n}  (${formatStackSummary(profiles[n])})`, value: n })),
    });
    const confirmed = await confirm({ message: `Delete "${toDelete}"?`, default: false });
    if (confirmed) deleteProfile(toDelete);
  }

  return { action };
}

// ─── Full stack setup ────────────────────────────────────────────────────────
export async function askFullStack() {
  const framework = await select({
    message: 'Framework:',
    choices: [
      { name: 'Next.js', value: 'nextjs' },
      { name: 'Vite + React', value: 'vite-react' },
      { name: 'Vite + Vue', value: 'vite-vue' },
      { name: 'Astro', value: 'astro' },
      { name: 'SvelteKit', value: 'sveltekit' },
      { name: 'Express API', value: 'express-api' },
      { name: 'Fastify API', value: 'fastify' },
      { name: 'Hono API', value: 'hono' },
      { name: 'Node.js CLI tool', value: 'node-cli' },
    ],
  });

  // Frameworks simples sin DB ni auth
  if (['vite-react', 'vite-vue', 'sveltekit', 'astro', 'node-cli', 'hono'].includes(framework)) {
    const versions = await askVersions(framework);
    const extras = await checkbox({
      message: 'Extras:',
      choices: [
        { name: 'ESLint + Prettier', value: 'eslint' },
        { name: 'Docker', value: 'docker' },
        { name: 'GitHub Actions CI', value: 'github-actions' },
      ],
    });
    return { framework, database: 'none', auth: 'none', testing: 'none', extras, versions };
  }

  const database = await select({
    message: 'Database:',
    choices: [
      { name: 'Prisma + PostgreSQL', value: 'prisma-postgres' },
      { name: 'Prisma + SQLite', value: 'prisma-sqlite' },
      { name: 'Mongoose + MongoDB', value: 'mongoose' },
      { name: 'None', value: 'none' },
    ],
  });

  const auth = await select({
    message: 'Auth:',
    choices: [
      { name: 'Auth.js (NextAuth)', value: 'authjs' },
      { name: 'JWT manual', value: 'jwt' },
      { name: 'None', value: 'none' },
    ],
  });

  const testing = await select({
    message: 'Testing:',
    choices: [
      { name: 'Vitest', value: 'vitest' },
      { name: 'Jest', value: 'jest' },
      { name: 'None', value: 'none' },
    ],
  });

  const versions = await askVersions(framework, { database, auth });

  const extras = await checkbox({
    message: 'Extras:',
    choices: [
      { name: 'ESLint + Prettier', value: 'eslint' },
      { name: 'Docker', value: 'docker' },
      { name: 'GitHub Actions CI', value: 'github-actions' },
      { name: 'Husky + lint-staged', value: 'husky' },
    ],
  });

  return { framework, database, auth, testing, extras, versions };
}

// ─── Version picker ──────────────────────────────────────────────────────────
async function askVersions(framework, options = {}) {
  const useCustom = await confirm({
    message: 'Use specific versions? (default: always latest)',
    default: false,
  });

  if (!useCustom) return {};

  const versions = {};

  // Paquete principal del framework
  const mainPkg = {
    nextjs: 'next',
    'vite-react': 'vite',
    'vite-vue': 'vite',
    astro: 'astro',
    sveltekit: '@sveltejs/kit',
    'express-api': 'express',
    fastify: 'fastify',
    hono: 'hono',
    'node-cli': null,
  }[framework];

  if (mainPkg && KNOWN_VERSIONS[mainPkg]) {
    versions[mainPkg] = await select({
      message: `${mainPkg} version:`,
      choices: KNOWN_VERSIONS[mainPkg].map((v) => ({
        name: v === 'latest' ? 'Latest (auto-updated)' : v,
        value: v,
      })),
    });
  }

  // React si aplica
  if (['nextjs', 'vite-react'].includes(framework) && KNOWN_VERSIONS['react']) {
    versions['react'] = await select({
      message: 'React version:',
      choices: KNOWN_VERSIONS['react'].map((v) => ({
        name: v === 'latest' ? 'Latest (auto-updated)' : v,
        value: v,
      })),
    });
  }

  // DB si aplica
  if (options.database === 'prisma-postgres' || options.database === 'prisma-sqlite') {
    versions['@prisma/client'] = await select({
      message: 'Prisma version:',
      choices: KNOWN_VERSIONS['@prisma/client'].map((v) => ({
        name: v === 'latest' ? 'Latest (auto-updated)' : v,
        value: v,
      })),
    });
  }

  return versions;
}
