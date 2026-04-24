import fs from 'fs';
import path from 'path';
import { resolveNpmDeps } from './versioning.js';

export async function generateProject(projectName, stack) {
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  switch (stack.framework) {
    case 'nextjs':       await generateNext(targetDir, stack); break;
    case 'express-api':  await generateExpress(targetDir, stack); break;
    case 'node-cli':     await generateNodeCli(targetDir, stack); break;
    case 'vite-react':   await generateViteReact(targetDir, stack); break;
    case 'vite-vue':     await generateViteVue(targetDir, stack); break;
    case 'fastify':      await generateFastify(targetDir, stack); break;
    case 'hono':         await generateHono(targetDir, stack); break;
    case 'sveltekit':    await generateSvelteKit(targetDir, stack); break;
    case 'astro':        await generateAstro(targetDir, stack); break;
    default: throw new Error(`Unknown framework: ${stack.framework}`);
  }

  generateGitignore(targetDir, stack.framework);
  if (stack.extras?.includes('eslint')) generateEslint(targetDir);
  if (stack.extras?.includes('docker')) generateDocker(targetDir, stack.framework);
  if (stack.extras?.includes('github-actions')) generateGithubActions(targetDir);
  if (stack.extras?.includes('husky')) generateHusky(targetDir);
}

// ─── Next.js ────────────────────────────────────────────────────────────────
async function generateNext(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/app'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/components'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/lib'), { recursive: true });

  const rawDeps = {
    next: '^14.0.0',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
  };

  if (stack.database === 'prisma-postgres' || stack.database === 'prisma-sqlite') {
    rawDeps['@prisma/client'] = '^5.0.0';
  }
  if (stack.auth === 'authjs') rawDeps['next-auth'] = '^4.24.0';

  const deps = await resolveNpmDeps(rawDeps);

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    scripts: { dev: 'next dev', build: 'next build', start: 'next start', lint: 'next lint' },
    dependencies: deps,
    devDependencies: await resolveNpmDeps({
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
    }),
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'src/app/page.tsx'), `export default function Home() {\n  return <main><h1>Welcome to your Stackr project</h1></main>;\n}\n`);
  fs.writeFileSync(path.join(dir, 'src/app/layout.tsx'), `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n`);
  fs.writeFileSync(path.join(dir, 'next.config.js'), `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n`);
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true, plugins: [{ name: 'next' }], paths: { '@/*': ['./src/*'] } }, include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }, null, 2));
  fs.writeFileSync(path.join(dir, '.env.example'), `# App\nNEXT_PUBLIC_APP_URL=http://localhost:3000\n${stack.database !== 'none' ? '\n# Database\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n' : ''}${stack.auth !== 'none' ? '\n# Auth\nAUTH_SECRET=your-secret-here\n' : ''}`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Vite + React ────────────────────────────────────────────────────────────
async function generateViteReact(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public'), { recursive: true });

  const deps = await resolveNpmDeps({ react: '^18.0.0', 'react-dom': '^18.0.0' });
  const devDeps = await resolveNpmDeps({
    vite: '^5.0.0',
    '@vitejs/plugin-react': '^4.0.0',
    typescript: '^5.0.0',
    '@types/react': '^18.0.0',
    '@types/react-dom': '^18.0.0',
  });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' },
    dependencies: deps,
    devDependencies: devDeps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'vite.config.ts'), `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n`);
  fs.writeFileSync(path.join(dir, 'src/main.tsx'), `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);\n`);
  fs.writeFileSync(path.join(dir, 'src/App.tsx'), `export default function App() {\n  return <h1>Welcome to your Stackr project</h1>;\n}\n`);
  fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Stackr App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Vite + Vue ──────────────────────────────────────────────────────────────
async function generateViteVue(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public'), { recursive: true });

  const deps = await resolveNpmDeps({ vue: '^3.0.0' });
  const devDeps = await resolveNpmDeps({
    vite: '^5.0.0',
    '@vitejs/plugin-vue': '^5.0.0',
    typescript: '^5.0.0',
    'vue-tsc': '^2.0.0',
  });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { dev: 'vite', build: 'vue-tsc && vite build', preview: 'vite preview' },
    dependencies: deps,
    devDependencies: devDeps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'vite.config.ts'), `import { defineConfig } from 'vite';\nimport vue from '@vitejs/plugin-vue';\nexport default defineConfig({ plugins: [vue()] });\n`);
  fs.writeFileSync(path.join(dir, 'src/main.ts'), `import { createApp } from 'vue';\nimport App from './App.vue';\ncreateApp(App).mount('#app');\n`);
  fs.writeFileSync(path.join(dir, 'src/App.vue'), `<template>\n  <h1>Welcome to your Stackr project</h1>\n</template>\n`);
  fs.writeFileSync(path.join(dir, 'index.html'), `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Stackr App</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Fastify ─────────────────────────────────────────────────────────────────
async function generateFastify(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/plugins'), { recursive: true });

  const rawDeps = { fastify: '^4.0.0', '@fastify/cors': '^9.0.0', '@fastify/helmet': '^11.0.0', dotenv: '^16.0.0' };
  if (stack.database === 'prisma-postgres' || stack.database === 'prisma-sqlite') rawDeps['@prisma/client'] = '^5.0.0';

  const deps = await resolveNpmDeps(rawDeps);

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'node --watch src/index.js', start: 'node src/index.js' },
    dependencies: deps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'src/index.js'), `import Fastify from 'fastify';\nimport cors from '@fastify/cors';\nimport helmet from '@fastify/helmet';\nimport 'dotenv/config';\n\nconst app = Fastify({ logger: true });\nawait app.register(cors);\nawait app.register(helmet);\n\napp.get('/health', async () => ({ status: 'ok' }));\n\nconst PORT = process.env.PORT || 3000;\nawait app.listen({ port: PORT, host: '0.0.0.0' });\n`);
  fs.writeFileSync(path.join(dir, '.env.example'), `PORT=3000\n${stack.database !== 'none' ? 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n' : ''}`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Hono ────────────────────────────────────────────────────────────────────
async function generateHono(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });

  const deps = await resolveNpmDeps({ hono: '^4.0.0' });
  const devDeps = await resolveNpmDeps({ typescript: '^5.0.0', '@types/node': '^20.0.0', tsx: '^4.0.0' });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'tsx watch src/index.ts', start: 'tsx src/index.ts', build: 'tsc' },
    dependencies: deps,
    devDependencies: devDeps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'src/index.ts'), `import { Hono } from 'hono';\nimport { cors } from 'hono/cors';\nimport { logger } from 'hono/logger';\n\nconst app = new Hono();\napp.use('*', logger());\napp.use('*', cors());\n\napp.get('/health', (c) => c.json({ status: 'ok' }));\n\nexport default app;\n`);
  fs.writeFileSync(path.join(dir, '.env.example'), `PORT=3000\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── SvelteKit ───────────────────────────────────────────────────────────────
async function generateSvelteKit(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/lib'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'static'), { recursive: true });

  const devDeps = await resolveNpmDeps({
    '@sveltejs/kit': '^2.0.0',
    '@sveltejs/adapter-auto': '^3.0.0',
    svelte: '^4.0.0',
    vite: '^5.0.0',
  });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    scripts: { dev: 'vite dev', build: 'vite build', preview: 'vite preview' },
    devDependencies: devDeps,
    type: 'module',
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'svelte.config.js'), `import adapter from '@sveltejs/adapter-auto';\nexport default { kit: { adapter: adapter() } };\n`);
  fs.writeFileSync(path.join(dir, 'vite.config.js'), `import { sveltekit } from '@sveltejs/kit/vite';\nimport { defineConfig } from 'vite';\nexport default defineConfig({ plugins: [sveltekit()] });\n`);
  fs.writeFileSync(path.join(dir, 'src/routes/+page.svelte'), `<h1>Welcome to your Stackr project</h1>\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Astro ───────────────────────────────────────────────────────────────────
async function generateAstro(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/pages'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/components'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'public'), { recursive: true });

  const devDeps = await resolveNpmDeps({ astro: '^4.0.0' });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: { dev: 'astro dev', build: 'astro build', preview: 'astro preview' },
    devDependencies: devDeps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'astro.config.mjs'), `import { defineConfig } from 'astro/config';\nexport default defineConfig({});\n`);
  fs.writeFileSync(path.join(dir, 'src/pages/index.astro'), `---\nconst title = 'Welcome to your Stackr project';\n---\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <title>{title}</title>\n  </head>\n  <body>\n    <h1>{title}</h1>\n  </body>\n</html>\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Express ─────────────────────────────────────────────────────────────────
async function generateExpress(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/middleware'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/controllers'), { recursive: true });

  const rawDeps = { express: '^4.18.0', dotenv: '^16.0.0', cors: '^2.8.5', helmet: '^7.0.0' };
  if (stack.auth === 'jwt') rawDeps['jsonwebtoken'] = '^9.0.0';
  if (stack.database === 'mongoose') rawDeps['mongoose'] = '^8.0.0';

  const deps = await resolveNpmDeps(rawDeps);

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'node --watch src/index.js', start: 'node src/index.js' },
    dependencies: deps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'src/index.js'), `import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport 'dotenv/config';\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.use(cors());\napp.use(helmet());\napp.use(express.json());\n\napp.get('/health', (req, res) => res.json({ status: 'ok' }));\n\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));\n`);
  fs.writeFileSync(path.join(dir, '.env.example'), `PORT=3000\n${stack.database === 'mongoose' ? 'MONGODB_URI=mongodb://localhost:27017/mydb\n' : ''}${stack.auth === 'jwt' ? 'JWT_SECRET=your-secret-here\n' : ''}`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Node CLI ────────────────────────────────────────────────────────────────
async function generateNodeCli(dir, stack) {
  fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });

  const deps = await resolveNpmDeps({ chalk: '^5.3.0', '@inquirer/prompts': '^5.0.0' });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    type: 'module',
    bin: { [path.basename(dir)]: './bin/index.js' },
    scripts: { start: 'node bin/index.js' },
    dependencies: deps,
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'bin/index.js'), `#!/usr/bin/env node\nimport { run } from '../src/index.js';\nrun();\n`);
  fs.writeFileSync(path.join(dir, 'src/index.js'), `import chalk from 'chalk';\n\nexport async function run() {\n  console.log(chalk.blue('Hello from your CLI!'));\n}\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

// ─── Shared generators ───────────────────────────────────────────────────────
function generateGitignore(dir, framework) {
  const extras = framework === 'nextjs' ? '\n.next\nout\n' : framework === 'astro' ? '\ndist\n.astro\n' : '\ndist\n';
  fs.writeFileSync(path.join(dir, '.gitignore'), `node_modules\n.env\n.env.local${extras}*.log\n`);
}

function generateEslint(dir) {
  fs.writeFileSync(path.join(dir, '.eslintrc.json'), JSON.stringify({ extends: ['eslint:recommended'], env: { node: true, es2022: true } }, null, 2));
  fs.writeFileSync(path.join(dir, '.prettierrc'), JSON.stringify({ semi: true, singleQuote: true, tabWidth: 2 }, null, 2));
}

function generateDocker(dir, framework) {
  fs.writeFileSync(path.join(dir, 'Dockerfile'), `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n`);
  fs.writeFileSync(path.join(dir, '.dockerignore'), `node_modules\n.env\n.next\ndist\n`);
}

function generateGithubActions(dir) {
  fs.mkdirSync(path.join(dir, '.github/workflows'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.github/workflows/ci.yml'), `name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm install\n      - run: npm run build\n`);
}

function generateHusky(dir) {
  fs.writeFileSync(path.join(dir, '.huskyrc.json'), JSON.stringify({ hooks: { 'pre-commit': 'npm run lint' } }, null, 2));
}

function generateReadme(name, stack) {
  const LABELS = {
    nextjs: 'Next.js', 'express-api': 'Express API', 'node-cli': 'Node.js CLI',
    'vite-react': 'Vite + React', 'vite-vue': 'Vite + Vue', fastify: 'Fastify',
    hono: 'Hono', sveltekit: 'SvelteKit', astro: 'Astro',
    'prisma-postgres': 'Prisma + PostgreSQL', 'prisma-sqlite': 'Prisma + SQLite',
    mongoose: 'Mongoose', authjs: 'Auth.js', jwt: 'JWT',
    vitest: 'Vitest', jest: 'Jest',
  };
  const label = (v) => LABELS[v] || v;
  const devCmd = ['node-cli'].includes(stack.framework) ? 'npm start' : 'npm run dev';
  return `# ${name}\n\nScaffolded with [Stackr](https://github.com/AndresDeC/stackr)\n\n## Stack\n- **Framework:** ${label(stack.framework)}\n- **Database:** ${label(stack.database) || 'none'}\n- **Auth:** ${label(stack.auth) || 'none'}\n- **Testing:** ${label(stack.testing) || 'none'}\n\n## Getting started\n\n\`\`\`bash\nnpm install\n${devCmd}\n\`\`\`\n\n## Environment variables\n\nCopy \`.env.example\` to \`.env\` and fill in your values.\n`;
}
