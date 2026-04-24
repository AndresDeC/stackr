import { checkbox, input, select } from '@inquirer/prompts';
import { formatStackSummary } from './preferences.js';

export async function askProjectName() {
  return input({
    message: 'Project name:',
    default: 'my-app',
    validate: (v) => v.trim().length > 0 || 'Project name cannot be empty',
  });
}

export async function askProfileSelection(profiles) {
  const choices = Object.keys(profiles).map((name) => ({
    name: `${name}  (${formatStackSummary(profiles[name])})`,
    value: profiles[name],
  }));

  choices.push({ name: '✨ Create new custom stack', value: 'new' });

  return select({
    message: 'Select a stack profile:',
    choices,
  });
}

export async function askProfileName() {
  return input({
    message: 'Save this stack as (e.g., "App 1", "Fast API"):',
    default: 'My Stack',
    validate: (v) => v.trim().length > 0 || 'Name cannot be empty',
  });
}

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

  if (['vite-react', 'vite-vue', 'sveltekit', 'astro', 'node-cli', 'hono'].includes(framework)) {
    const extras = await checkbox({
      message: 'Extras: (space to select)',
      choices: [
        { name: 'ESLint + Prettier', value: 'eslint' },
        { name: 'Docker', value: 'docker' },
        { name: 'GitHub Actions CI', value: 'github-actions' },
      ],
    });
    return { framework, database: 'none', auth: 'none', testing: 'none', extras };
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

  const extras = await checkbox({
    message: 'Extras: (space to select)',
    choices: [
      { name: 'ESLint + Prettier', value: 'eslint' },
      { name: 'Docker', value: 'docker' },
      { name: 'GitHub Actions CI', value: 'github-actions' },
      { name: 'Husky + lint-staged', value: 'husky' },
    ],
  });

  return { framework, database, auth, testing, extras };
}
