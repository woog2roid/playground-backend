import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { Friends } from '../../entities/Friends.entity';
import { Chats } from '../../entities/Chats.entity';
import { ChatRooms } from '../../entities/ChatRooms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends, Chats, ChatRooms])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}