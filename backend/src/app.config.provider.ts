export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  url: string;
  username: string;
  password: string;
}

export const configProvider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfig => ({
    database: {
      url: process.env.DATABASE_URL ?? 'mongodb://127.0.0.1:27017/afisha',
      username: process.env.DATABASE_USERNAME ?? '',
      password: process.env.DATABASE_PASSWORD ?? '',
    },
  }),
};
