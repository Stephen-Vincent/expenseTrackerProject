import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSource } from './infrastructure/orm/source';
import { AppConfig, fromService } from './infrastructure/configuration';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const appConfig = fromService(configService);
        return getDataSource({
          connectionUrl: appConfig.database.connectionUrl,
          enableLogging: appConfig.database.enableLogging,
        });
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    ExpensesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
