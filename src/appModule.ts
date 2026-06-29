import { Module, Controller, Get } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { Type } from '@nestjs/common';
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * ── Module assembly contract (SYS-265) ────────────────────────────────────────
 * Each story is a self-contained module directory `src/modules/<story>/`. To be
 * mounted into the running service, a module exports a NestJS `@Module` class —
 * from its `index.ts` barrel (preferred) or any `*.module.ts` file. The code-gen
 * pipeline synthesises that barrel from the controllers/services it generates, so
 * the module classes are discovered here with no central wiring file to edit.
 *
 * `buildAppModule` scans the compiled `modules/` directory next to this file,
 * collects every exported `@Module` class, validates each in isolation, and
 * returns a root module importing the survivors plus a `/health` controller.
 * A directory that exports no module class, or whose module fails to bootstrap
 * (e.g. an unresolved provider), is logged and skipped — one bad module never
 * stops the service from booting.
 */

@Controller()
class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', service: process.env.SERVICE_NAME ?? 'aegis-app' };
  }
}

// Public NestJS @Module metadata keys — present iff the class was @Module-decorated.
const MODULE_METADATA_KEYS = ['imports', 'controllers', 'providers', 'exports'];

function isNestModule(value: unknown): value is Type {
  if (typeof value !== 'function') return false;
  return MODULE_METADATA_KEYS.some((k) => Reflect.getMetadata(k, value) !== undefined);
}

/** Load a story dir's exports: prefer index, then any *.module.* , then merge all files. */
function loadModuleExports(dir: string): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  const tryRequire = (file: string): void => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Object.assign(merged, require(file));
  };
  for (const idx of ['index.js', 'index.ts']) {
    const p = join(dir, idx);
    if (existsSync(p)) {
      tryRequire(p);
      if (Object.values(merged).some(isNestModule)) return merged;
    }
  }
  for (const f of readdirSync(dir)) {
    if (!/\.(js|ts)$/.test(f) || /\.(test|spec)\./.test(f)) continue;
    try {
      tryRequire(join(dir, f));
    } catch {
      // ignore a single unloadable file; other files may still export a module
    }
  }
  return merged;
}

/** Discover every @Module class under `modulesDir` ([{ name, module }]). */
export function collectModules(
  modulesDir: string = join(__dirname, 'modules'),
): Array<{ name: string; module: Type }> {
  const found: Array<{ name: string; module: Type }> = [];
  if (!existsSync(modulesDir)) return found;

  for (const entry of readdirSync(modulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    try {
      const mods = Object.values(loadModuleExports(join(modulesDir, name))).filter(isNestModule);
      if (mods.length === 0) {
        // eslint-disable-next-line no-console
        console.warn(`[app] module "${name}" exports no @Module — skipped`);
        continue;
      }
      for (const module of mods) found.push({ name, module });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[app] module "${name}" failed to load — skipped:`, (err as Error).message);
    }
  }
  return found;
}

function rootModule(imports: Type[]): Type {
  @Module({ imports, controllers: [HealthController] })
  class AppModule {}
  return AppModule;
}

/** True if a set of feature modules bootstraps cleanly (DI resolves). */
async function validates(imports: Type[]): Promise<boolean> {
  try {
    // abortOnError:false makes Nest THROW on a DI failure instead of its default
    // behaviour of logging + process.exit(1) — which would take the whole service
    // down while we are only probing a single module.
    const app = await NestFactory.create(rootModule(imports), {
      logger: false,
      abortOnError: false,
    });
    await app.close();
    return true;
  } catch {
    return false;
  }
}

/**
 * Build the root application module from the discovered story modules, dropping
 * any whose dependency injection does not resolve so the service still boots.
 */
export async function buildAppModule(
  modulesDir: string = join(__dirname, 'modules'),
): Promise<Type> {
  const discovered = collectModules(modulesDir);
  const healthy: Type[] = [];
  for (const { name, module } of discovered) {
    if (await validates([module])) {
      healthy.push(module);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`[app] module "${name}" failed dependency injection — skipped`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[app] mounted ${healthy.length} module(s) of ${discovered.length} discovered`);
  return rootModule(healthy);
}
