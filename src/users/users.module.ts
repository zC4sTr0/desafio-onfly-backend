import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    }],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
