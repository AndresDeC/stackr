# Architecture decisions

This document explains the key decisions behind Stackr. It's written for developers who want to understand *why* things are built this way, not just how to use them.

---

## Why a CLI and not a web app?

Developers live in the terminal. A web app adds friction — you have to open a browser, wait for it to load, copy-paste the output. A CLI is where developers already are. Zero context switching.

## Why save preferences locally (`~/.stackr/config.json`) and not in a cloud account?

Two reasons:

1. **No server cost.** Cloud storage means a server, a database, auth, and ongoing maintenance. Storing preferences on the user's machine is free, instant, and offline-first.
2. **Privacy.** Developers shouldn't need an account to use a scaffold tool. Your preferences are yours — they live on your machine.

## Why `@inquirer/prompts` over `inquirer` directly?

`@inquirer/prompts` is the new modular API from the same authors. It supports ES modules natively, has better TypeScript types, and each prompt is imported individually — so the bundle only includes what's used. The legacy `inquirer` package is in maintenance mode.

## Why `chalk` and `ora`?

UX matters even in CLIs. `chalk` adds color for readability (errors in red, success in green). `ora` adds a spinner during file generation so the user knows something is happening. Both are zero-dependency, ESM-native, and battle-tested.

## Why ESM (`"type": "module"`) over CommonJS?

The Node.js ecosystem is moving to ESM. All major packages (`chalk`, `ora`, `@inquirer/prompts`) have dropped CommonJS support in their latest versions. Starting with ESM avoids painful migrations later.

## Why generate files directly instead of using `degit` to clone templates?

`degit` requires the templates to live in a remote GitHub repo. That adds latency (network request), a dependency on GitHub availability, and complexity in keeping templates up to date. Generating files programmatically means everything ships inside the npm package — fully offline, zero external dependencies at runtime.

## What's next

- [ ] Support for more frameworks (Fastify, Hono, SvelteKit)
- [ ] Named profiles — save multiple stacks with different names
- [ ] Plugin system for community-contributed templates
- [ ] Interactive update command to migrate existing projects
