import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsService } from './films/films.service';
import { FilmsController } from './films/films.controller';
import { FilmsRepository } from './films/films.repository';
import { Film, FilmSchema } from './films/films.schema';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL ?? 'mongodb://127.0.0.1:27017/afisha'),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/content/afisha',
    }),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsRepository, FilmsService, OrderService],
})
export class AppModule {}
