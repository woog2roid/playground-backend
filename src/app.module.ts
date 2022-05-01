import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './api/user/user.module';
import { FriendModule } from './api/friend/friend.module';
import { ChatModule } from './api/chat/chat.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    AuthModule,
    FriendModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
