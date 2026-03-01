import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { AppConfigModule } from './app.config.module';
import { FilmsService } from './films/films.service';
import { FilmsController } from './films/films.controller';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { FilmsRepositoryModule } from './films/films.repository.module';
import { appLoggerProvider } from './logger/app-logger.provider';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    FilmsRepositoryModule.register(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    FilmsService,
    OrderService,
    DevLogger,
    JsonLogger,
    TskvLogger,
    appLoggerProvider,
  ],
})
export class AppModule {}
