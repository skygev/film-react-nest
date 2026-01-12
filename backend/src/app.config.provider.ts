export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export const configProvider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfig => ({
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'mongodb',
      url: process.env.DATABASE_URL ?? 'mongodb://127.0.0.1:27017/afisha',
    },
  }),
};
