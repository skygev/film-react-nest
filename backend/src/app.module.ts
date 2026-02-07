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
  providers: [FilmsService, OrderService],
})
export class AppModule {}
