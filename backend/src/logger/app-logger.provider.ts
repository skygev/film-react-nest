import { FactoryProvider, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { APP_LOGGER } from './logger.constants';
import { TskvLogger } from './tskv.logger';

type LogFormat = 'dev' | 'json' | 'tskv';

const LOG_FORMATS: LogFormat[] = ['dev', 'json', 'tskv'];

const getLogFormat = (configService: ConfigService): LogFormat => {
  const value = configService.get<string>('LOG_FORMAT');
  const normalizedValue = value?.toLowerCase();

  if (normalizedValue && LOG_FORMATS.includes(normalizedValue as LogFormat)) {
    return normalizedValue as LogFormat;
  }

  return 'dev';
};

export const appLoggerProvider: FactoryProvider<LoggerService> = {
  provide: APP_LOGGER,
  inject: [ConfigService, DevLogger, JsonLogger, TskvLogger],
  useFactory: (
    configService: ConfigService,
    devLogger: DevLogger,
    jsonLogger: JsonLogger,
    tskvLogger: TskvLogger,
  ) => {
    const logFormat = getLogFormat(configService);

    if (logFormat === 'json') {
      return jsonLogger;
    }

    if (logFormat === 'tskv') {
      return tskvLogger;
    }

    return devLogger;
  },
};

export { getLogFormat };

