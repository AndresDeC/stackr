const CACHE = new Map();

async function fetchLatest(url, extract) {
  if (CACHE.has(url)) return CACHE.get(url);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    const version = extract(data);
    if (version) CACHE.set(url, version);
    return version ?? null;
  } catch {
    return null;
  }
}

// npm — https://registry.npmjs.org/<pkg>/latest
export async function npmLatest(pkg) {
  return fetchLatest(
    `https://registry.npmjs.org/${pkg}/latest`,
    (d) => d.version
  );
}

// PyPI — https://pypi.org/pypi/<pkg>/json
export async function pypiLatest(pkg) {
  return fetchLatest(
    `https://pypi.org/pypi/${pkg}/json`,
    (d) => d.info?.version
  );
}

// crates.io — https://crates.io/api/v1/crates/<pkg>
export async function crateLatest(pkg) {
  return fetchLatest(
    `https://crates.io/api/v1/crates/${pkg}`,
    (d) => d.crate?.newest_version
  );
}

// Resuelve un mapa de dependencias a sus versiones más recientes
// Si falla el fetch usa el fallback hardcodeado
// Ejemplo: await resolveNpmDeps({ react: '^18.0.0', next: '^14.0.0' })
export async function resolveNpmDeps(deps) {
  const resolved = {};
  await Promise.all(
    Object.entries(deps).map(async ([pkg, fallback]) => {
      const latest = await npmLatest(pkg);
      resolved[pkg] = latest ? `^${latest}` : fallback;
    })
  );
  return resolved;
}

export async function resolvePypiDeps(deps) {
  const resolved = {};
  await Promise.all(
    Object.entries(deps).map(async ([pkg, fallback]) => {
      const latest = await pypiLatest(pkg);
      resolved[pkg] = latest ? `>=${latest}` : fallback;
    })
  );
  return resolved;
}

export async function resolveCrateDeps(deps) {
  const resolved = {};
  await Promise.all(
    Object.entries(deps).map(async ([pkg, fallback]) => {
      const latest = await crateLatest(pkg);
      resolved[pkg] = latest ? `${latest}` : fallback;
    })
  );
  return resolved;
}
