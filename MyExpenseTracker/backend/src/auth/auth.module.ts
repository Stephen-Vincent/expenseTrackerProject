import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/orm/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, fromService } from 'src/infrastructure/configuration';
import { AuthStrategy } from './auth.strategy';
import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forFeature(AppConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: fromService(configService).auth.secretKey,
          signOptions: {
            issuer: 'expense-tracker',
            algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, CategoryEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
})
export class AuthModule {}
