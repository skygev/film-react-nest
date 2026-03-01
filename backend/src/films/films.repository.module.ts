import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../app.config.module';
import { APP_CONFIG, AppConfig } from '../app.config.provider';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { MongoFilmsRepository } from './films.mongo.repository';
import { FilmsRepository } from './films.repository';
import { Film, FilmSchema } from './films.schema';
import { TypeormFilmsRepository } from './films.typeorm.repository';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig) => ({
        type: 'postgres' as const,
        url: config.database.url,
        username: config.database.username,
        password: config.database.password,
        entities: [FilmEntity, ScheduleEntity],
        synchronize: false,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  providers: [
    TypeormFilmsRepository,
    {
      provide: FilmsRepository,
      useExisting: TypeormFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
class FilmsTypeormRepositoryModule {}

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig) => ({
        uri: config.database.url,
        user: config.database.username,
        pass: config.database.password,
      }),
    }),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [
    MongoFilmsRepository,
    {
      provide: FilmsRepository,
      useExisting: MongoFilmsRepository,
    },
  ],
  exports: [FilmsRepository],
})
class FilmsMongoRepositoryModule {}

@Module({})
export class FilmsRepositoryModule {
  static register(): DynamicModule {
    const driver = (process.env.DATABASE_DRIVER ?? 'postgres').toLowerCase();
    const databaseModule =
      driver === 'mongodb'
        ? FilmsMongoRepositoryModule
        : FilmsTypeormRepositoryModule;

    return {
      module: FilmsRepositoryModule,
      imports: [databaseModule],
      exports: [databaseModule],
    };
  }
}
