import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { buildAppModule } from './appModule';

/**
 * AEGIS generated application entrypoint (NestJS).
 *
 * The root module is assembled at boot from the per-story feature modules found
 * under `dist/modules/*` — see appModule.ts for the full assembly contract.
 * Modules are validated individually first, so one module that fails dependency
 * injection is skipped rather than taking the whole service down.
 */
async function bootstrap(): Promise<void> {
  const AppModule = await buildAppModule();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    abortOnError: false,
  });
  app.enableShutdownHooks();
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[app] listening on :${port}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[app] failed to start:', err);
  process.exit(1);
});
