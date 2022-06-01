import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../database/entities/Users.entity';
import { Friends } from '../../database/entities/Friends.entity';
import { Chats } from '../../database/entities/Chats.entity';
import { ChatRooms } from '../../database/entities/ChatRooms.entity';
import { SocketModule } from 'src/socket/socket.module';
import { ChatRoomMembers } from 'src/database/entities/ChatRoomMembers.entity';

import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Friends,
      Chats,
      ChatRooms,
      ChatRoomMembers,
    ]),
    SocketModule,
    ConfigService,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
