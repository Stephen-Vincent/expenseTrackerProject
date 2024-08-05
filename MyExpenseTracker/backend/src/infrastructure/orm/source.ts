import { DataSourceOptions } from 'typeorm';

interface ConnectionOptions {
  connectionUrl: string;
  enableLogging?: boolean;
  timeout?: number;
}

export const getDataSource = (options: ConnectionOptions) => {
  return {
    type: 'mongodb',
    url: options.connectionUrl,
    entities: [`${__dirname}/entities/*.{ts,js}`],
    logging: options.enableLogging ? 'all' : ['error'],
    connectTimeoutMS: options.timeout ?? 5000,
    synchronize: true,
  } as DataSourceOptions;
};
