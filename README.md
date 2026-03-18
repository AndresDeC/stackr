# Stackr

> Scaffold your preferred stack — with memory.

Stackr is a CLI tool that scaffolds projects the way *you* like them. It remembers your stack preferences so you can go from zero to coding in seconds.

```bash
npx create-stackr
```

---

## Why Stackr?

Every developer wastes hours configuring the same stack over and over. `create-next-app` is opinionated. Boilerplates go stale. Stackr is different — it learns your preferences and builds exactly what you want, every time.

## Features

- **Stack memory** — saves your preferences in `~/.stackr/config.json`
- **One-command scaffold** — run `npx create-stackr` and you're done
- **Multi-framework** — Next.js, Express API, Node.js CLI tools
- **Extras** — ESLint + Prettier, Docker, GitHub Actions, Husky

## Usage

```bash
npx create-stackr
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

See [DECISIONS.md](./DECISIONS.md) for the architecture and design decisions behind Stackr.

## License

MIT © Andrés Deandar
