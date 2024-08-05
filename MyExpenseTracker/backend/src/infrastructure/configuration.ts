import { ConfigService, registerAs } from '@nestjs/config';

export const APP_CONFIG_KEY = 'AppConfig';

interface AppConfig {
  port: number;
  database: {
    connectionUrl: string;
    enableLogging: boolean;
  };
  auth: {
    secretKey: string;
  };
}

export const AppConfig = registerAs(APP_CONFIG_KEY, (): AppConfig => {
  return {
    port: parseInt(process.env.PORT) ?? 3000,
    database: {
      connectionUrl: process.env.CONNECTION_URL,
      enableLogging: process.env.ENABLE_DB_LOGGING == 'true',
    },
    auth: {
      secretKey: process.env.JWT_SECRET_KEY,
    },
  };
});

export const fromService = (configService: ConfigService) => {
  const config = configService.get<AppConfig>(APP_CONFIG_KEY);
  if (!config) throw new Error('Environment not properly configured');
  return config;
};
