import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { Friends } from '../../entities/Friends.entity';
import { Chats } from '../../entities/Chats.entity';
import { ChatRooms } from '../../entities/ChatRooms.entity';
import { SocketModule } from 'src/socket/socket.module';
import { ChatRoomMembers } from 'src/entities/ChatRoomMembers.entity';

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
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
