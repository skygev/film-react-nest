export const APP_CONFIG = 'APP_CONFIG';

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}

export const configProvider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfig => ({
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'postgres',
      url: process.env.DATABASE_URL ?? 'postgresql://127.0.0.1:5432/prac',
      username: process.env.DATABASE_USERNAME ?? 'film',
      password: process.env.DATABASE_PASSWORD ?? 'film',
    },
  }),
};
