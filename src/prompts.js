import { input, select, checkbox } from '@inquirer/prompts';

export async function askProjectName() {
  return input({
    message: 'Project name:',
    default: 'my-app',
    validate: (v) => v.trim().length > 0 || 'Project name cannot be empty',
  });
}

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
  });
}

export async function askFullStack() {
  const framework = await select({
    message: 'Framework:',
    choices: [
      { name: 'Next.js', value: 'nextjs' },
      { name: 'Express API', value: 'express-api' },
      { name: 'Node.js CLI tool', value: 'node-cli' },
    ],
  });

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
