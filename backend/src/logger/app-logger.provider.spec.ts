import { ConfigService } from '@nestjs/config';

import { appLoggerProvider, getLogFormat } from './app-logger.provider';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

describe('appLoggerProvider', () => {
  const devLogger = new DevLogger();
  const jsonLogger = new JsonLogger();
  const tskvLogger = new TskvLogger();

  const createConfigService = (value?: string) =>
    ({
      get: jest.fn().mockReturnValue(value),
    }) as unknown as ConfigService;

  it('returns json logger when LOG_FORMAT is json', () => {
    const configService = createConfigService('json');

    const logger = appLoggerProvider.useFactory!(
      configService,
      devLogger,
      jsonLogger,
      tskvLogger,
    );

    expect(logger).toBe(jsonLogger);
  });

  it('returns tskv logger when LOG_FORMAT is tskv', () => {
    const configService = createConfigService('tskv');

    const logger = appLoggerProvider.useFactory!(
      configService,
      devLogger,
      jsonLogger,
      tskvLogger,
    );

    expect(logger).toBe(tskvLogger);
  });

  it('returns dev logger by default', () => {
    const configService = createConfigService(undefined);

    const logger = appLoggerProvider.useFactory!(
      configService,
      devLogger,
      jsonLogger,
      tskvLogger,
    );

    expect(logger).toBe(devLogger);
  });
});

describe('getLogFormat', () => {
  const createConfigService = (value?: string) =>
    ({
      get: jest.fn().mockReturnValue(value),
    }) as unknown as ConfigService;

  it('normalizes register', () => {
    const configService = createConfigService('JSON');

    expect(getLogFormat(configService)).toBe('json');
  });

  it('falls back to dev for unsupported format', () => {
    const configService = createConfigService('xml');

    expect(getLogFormat(configService)).toBe('dev');
  });
});

