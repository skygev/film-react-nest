import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigModule } from '../app.config.module';
import { APP_CONFIG, AppConfig } from '../app.config.provider';
import { MongoFilmsRepository } from './films.mongo.repository';
import { FilmsRepository } from './films.repository';
import { Film, FilmSchema } from './films.schema';

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
export class FilmsRepositoryModule {
}
