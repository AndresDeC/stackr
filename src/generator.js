import fs from 'fs';
import path from 'path';

export async function generateProject(projectName, stack) {
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  switch (stack.framework) {
    case 'nextjs':
      await generateNext(targetDir, stack);
      break;
    case 'express-api':
      await generateExpress(targetDir, stack);
      break;
    case 'node-cli':
      await generateNodeCli(targetDir, stack);
      break;
    default:
      throw new Error(`Unknown framework: ${stack.framework}`);
  }

  generateGitignore(targetDir);
  if (stack.extras?.includes('eslint')) generateEslint(targetDir);
  if (stack.extras?.includes('docker')) generateDocker(targetDir, stack.framework);
  if (stack.extras?.includes('github-actions')) generateGithubActions(targetDir);
}

function generateNext(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/app'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/components'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/lib'), { recursive: true });

  const deps = {
    next: '^14.0.0',
    react: '^18.0.0',
    'react-dom': '^18.0.0',
  };

  if (stack.database === 'prisma-postgres' || stack.database === 'prisma-sqlite') {
    deps['@prisma/client'] = '^5.0.0';
  }
  if (stack.auth === 'authjs') {
    deps['next-auth'] = '^5.0.0';
  }

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: deps,
    devDependencies: {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
    },
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'src/app/page.tsx'), `export default function Home() {\n  return <main><h1>Welcome to your Stackr project</h1></main>;\n}\n`);
  fs.writeFileSync(path.join(dir, 'src/app/layout.tsx'), `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n`);
  fs.writeFileSync(path.join(dir, '.env.example'), `# App\nNEXT_PUBLIC_APP_URL=http://localhost:3000\n\n${stack.database !== 'none' ? '# Database\nDATABASE_URL="postgresql://user:password@localhost:5432/mydb"\n\n' : ''}${stack.auth !== 'none' ? '# Auth\nAUTH_SECRET=your-secret-here\n' : ''}`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

function generateExpress(dir, stack) {
  fs.mkdirSync(path.join(dir, 'src/routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/middleware'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/controllers'), { recursive: true });

  const deps = {
    express: '^4.18.0',
    dotenv: '^16.0.0',
    cors: '^2.8.5',
    helmet: '^7.0.0',
  };

  if (stack.auth === 'jwt') deps['jsonwebtoken'] = '^9.0.0';
  if (stack.database === 'mongoose') deps['mongoose'] = '^8.0.0';

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

function generateNodeCli(dir, stack) {
  fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });

  const pkg = {
    name: path.basename(dir),
    version: '0.1.0',
    type: 'module',
    bin: { [path.basename(dir)]: './bin/index.js' },
    scripts: { start: 'node bin/index.js' },
    dependencies: { chalk: '^5.3.0', '@inquirer/prompts': '^5.0.0' },
  };

  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(path.join(dir, 'bin/index.js'), `#!/usr/bin/env node\nimport { run } from '../src/index.js';\nrun();\n`);
  fs.writeFileSync(path.join(dir, 'src/index.js'), `import chalk from 'chalk';\n\nexport async function run() {\n  console.log(chalk.blue('Hello from your CLI!'));\n}\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), generateReadme(path.basename(dir), stack));
}

function generateGitignore(dir) {
  fs.writeFileSync(path.join(dir, '.gitignore'), `node_modules\n.env\n.env.local\n.next\ndist\n*.log\n`);
}

function generateEslint(dir) {
  fs.writeFileSync(path.join(dir, '.eslintrc.json'), JSON.stringify({ extends: ['eslint:recommended'], env: { node: true, es2022: true } }, null, 2));
  fs.writeFileSync(path.join(dir, '.prettierrc'), JSON.stringify({ semi: true, singleQuote: true, tabWidth: 2 }, null, 2));
}

function generateDocker(dir, framework) {
  const port = framework === 'nextjs' ? 3000 : 3000;
  fs.writeFileSync(path.join(dir, 'Dockerfile'), `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE ${port}\nCMD ["npm", "start"]\n`);
  fs.writeFileSync(path.join(dir, '.dockerignore'), `node_modules\n.env\n.next\n`);
}

function generateGithubActions(dir) {
  fs.mkdirSync(path.join(dir, '.github/workflows'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.github/workflows/ci.yml'), `name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm install\n      - run: npm run lint\n`);
}

function generateReadme(name, stack) {
  return `# ${name}\n\nScaffolded with [Stackr](https://github.com/yourusername/stackr)\n\n## Stack\n- **Framework:** ${stack.framework}\n- **Database:** ${stack.database || 'none'}\n- **Auth:** ${stack.auth || 'none'}\n- **Testing:** ${stack.testing || 'none'}\n\n## Getting started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Environment variables\n\nCopy \`.env.example\` to \`.env\` and fill in your values.\n`;
}
