import { npmLatest } from './versioning.js';

// Versiones conocidas por framework — el usuario puede elegir
export const KNOWN_VERSIONS = {
  // React
  react: ['latest', '18.3.1', '18.2.0', '17.0.2'],
  'react-dom': ['latest', '18.3.1', '18.2.0', '17.0.2'],
  // Next.js
  next: ['latest', '14.2.0', '13.5.0', '12.3.0'],
  // Vue
  vue: ['latest', '3.4.0', '3.3.0', '2.7.0'],
  // Vite
  vite: ['latest', '5.2.0', '4.5.0', '3.2.0'],
  // Express
  express: ['latest', '4.19.0', '4.18.0', '4.17.0'],
  // Fastify
  fastify: ['latest', '4.27.0', '4.26.0', '4.0.0'],
  // Hono
  hono: ['latest', '4.3.0', '4.0.0', '3.12.0'],
  // Astro
  astro: ['latest', '4.8.0', '4.0.0', '3.6.0'],
  // SvelteKit
  '@sveltejs/kit': ['latest', '2.5.0', '2.0.0', '1.30.0'],
  // Prisma
  '@prisma/client': ['latest', '5.14.0', '5.0.0', '4.16.0'],
  // Auth
  'next-auth': ['latest', '4.24.7', '4.24.0', '4.20.0'],
  // Mongoose
  mongoose: ['latest', '8.4.0', '8.0.0', '7.6.0'],
};

// Resuelve versiones según la elección del usuario
// Si elige 'latest' consulta npm en tiempo real
// Si elige una versión específica la usa directamente
export async function resolveVersion(pkg, choice) {
  if (choice === 'latest') {
    const fetched = await npmLatest(pkg);
    return fetched ? `^${fetched}` : KNOWN_VERSIONS[pkg]?.[1] || 'latest';
  }
  return `^${choice}`;
}

export async function resolveVersionMap(versionChoices) {
  const resolved = {};
  await Promise.all(
    Object.entries(versionChoices).map(async ([pkg, choice]) => {
      resolved[pkg] = await resolveVersion(pkg, choice);
    })
  );
  return resolved;
}
