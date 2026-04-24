<<<<<<< HEAD
import { input, select, checkbox } from '@inquirer/prompts';
=======
import { checkbox, input, select } from '@inquirer/prompts';
import { formatStackSummary } from './preferences.js';
>>>>>>> dadcffd (Commit stackr ultimate)

export async function askProjectName() {
  return input({
    message: 'Project name:',
    default: 'my-app',
    validate: (v) => v.trim().length > 0 || 'Project name cannot be empty',
  });
}

<<<<<<< HEAD
export async function askStackMode(summary) {
  return select({
    message: 'Stack setup:',
    choices: [
      {
        name: `Same as before  (${summary})`,
        value: 'same',
      },
      {
        name: 'Different stack',
        value: 'different',
      },
    ],
=======
// NUEVO: Menú interactivo con todos los perfiles guardados
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

// NUEVO: Preguntar el nombre para guardar el stack
export async function askProfileName() {
  return input({
    message: 'Save this stack as (e.g., "App 1", "Fast API"):',
    default: 'My Stack',
    validate: (v) => v.trim().length > 0 || 'Name cannot be empty',
>>>>>>> dadcffd (Commit stackr ultimate)
  });
}

export async function askFullStack() {
  const framework = await select({
    message: 'Framework:',
    choices: [
      { name: 'Next.js', value: 'nextjs' },
<<<<<<< HEAD
      { name: 'Express API', value: 'express-api' },
=======
      { name: 'Vite + React', value: 'vite-react' },
      { name: 'Vite + Vue', value: 'vite-vue' },
      { name: 'Astro', value: 'astro' },
      { name: 'SvelteKit', value: 'sveltekit' },
      { name: 'Express API', value: 'express-api' },
      { name: 'Fastify API', value: 'fastify' },
      { name: 'Hono API', value: 'hono' },
>>>>>>> dadcffd (Commit stackr ultimate)
      { name: 'Node.js CLI tool', value: 'node-cli' },
    ],
  });

<<<<<<< HEAD
=======
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

>>>>>>> dadcffd (Commit stackr ultimate)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> dadcffd (Commit stackr ultimate)
