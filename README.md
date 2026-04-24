# Stackr

> Scaffold your preferred stack — with memory.

Stackr is a CLI tool that scaffolds projects the way *you* like them. It remembers your stack preferences so you can go from zero to coding in seconds.

# Install
```bash
npm install stackr-ultimate
```

---

## Why Stackr?

Every developer wastes hours configuring the same stack over and over. `create-next-app` is opinionated. Boilerplates go stale. Stackr is different — it learns your preferences and builds exactly what you want, every time.

## Features

- **Stack memory** — saves your preferences in `~/.stackr/config.json`
- **One-command scaffold** — run `npx create-stackr` and you're done
- **Multi-framework** — Next.js, Express API, Node.js CLI tools
- **Extras** — ESLint + Prettier, Docker, GitHub Actions, Husky

## One use

```bash
npx stackr-ultimate
```

First run — Stackr walks you through your stack:

```
◆ Stackr — scaffold your stack, your way

? Project name: my-app
? Framework: Next.js
? Database: Prisma + PostgreSQL
? Auth: Auth.js (NextAuth)
? Testing: Vitest
? Extras: ESLint + Prettier, GitHub Actions CI
```

Second run — Stackr remembers:

```
◆ Stackr — scaffold your stack, your way

? Project name: another-app
? Stack setup:
  ❯ Same as before  (Next.js + Prisma + Auth.js)
    Different stack
```

## Supported stacks

| Framework     | Databases                        | Auth          | Testing       |
|---------------|----------------------------------|---------------|---------------|
| Next.js       | Prisma + PostgreSQL, SQLite, None | Auth.js, None | Vitest, Jest  |
| Express API   | Mongoose + MongoDB, None          | JWT, None     | Vitest, Jest  |
| Node.js CLI   | —                                 | —             | Vitest, Jest  |

## Decisions

---

# Stackr
> Genera tu stack preferido — con memoria.
 
Stackr es una herramienta CLI que genera proyectos exactamente como *tú* los quieres. Recuerda tus preferencias para que puedas pasar de cero a programar en segundos.
 
# Descarga
```bash
npm install stackr-ultimate
```
 
---
 
## ¿Por qué Stackr?
 
Todo developer pierde horas configurando el mismo stack una y otra vez. `create-next-app` es demasiado opinionado. Los boilerplates se quedan obsoletos. Stackr es diferente — aprende tus preferencias y construye exactamente lo que necesitas, siempre.
 
## Características
 
- **Memoria de stack** — guarda tus preferencias en `~/.stackr/config.json`
- **Un solo comando** — corre `npx create-stackr` y listo
- **Multi-framework** — Next.js, Express API, herramientas CLI de Node.js
- **Extras** — ESLint + Prettier, Docker, GitHub Actions, Husky
 
## Uso unico
 
```bash
npx stackr-ultimate
```
 
Primera vez — Stackr te guía por tu stack:
 
```
◆ Stackr — scaffold your stack, your way
 
? Project name: mi-app
? Framework: Next.js
? Database: Prisma + PostgreSQL
? Auth: Auth.js (NextAuth)
? Testing: Vitest
? Extras: ESLint + Prettier, GitHub Actions CI
```
 
Segunda vez — Stackr recuerda:
 
```
◆ Stackr — scaffold your stack, your way
 
? Project name: otra-app
? Stack setup:
  ❯ Same as before  (Next.js + Prisma + Auth.js)
    Different stack
```
 
## Stacks soportados
 
| Framework     | Bases de datos                    | Auth          | Testing       |
|---------------|-----------------------------------|---------------|---------------|
| Next.js       | Prisma + PostgreSQL, SQLite, None | Auth.js, None | Vitest, Jest  |
| Express API   | Mongoose + MongoDB, None          | JWT, None     | Vitest, Jest  |
| Node.js CLI   | —                                 | —             | Vitest, Jest  |
 
## Decisiones
 
Ver [DECISIONS.md](./DECISIONS.md) para las decisiones de arquitectura y diseño detrás de Stackr.
 
## Licencia
 
MIT © Andrés Deandar
See [DECISIONS.md](./DECISIONS.md) for the architecture and design decisions behind Stackr.

## License

MIT © Andrés Deandar
