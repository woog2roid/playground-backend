import { Module } from '@nestjs/common';
import { ChatSocketGateway } from './chat-socket.gateway';

@Module({
  providers: [ChatSocketGateway],
  exports: [ChatSocketGateway],
})
export class SocketModule {}
