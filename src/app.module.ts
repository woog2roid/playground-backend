import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { FriendsModule } from './api/friends/friends.module';
import { ChatsModule } from './api/chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    AuthModule,
    FriendsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
