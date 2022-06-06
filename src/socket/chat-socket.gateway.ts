import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { socketMemory as memory, socketMemory } from './socket-memory';

@WebSocketGateway({ namespace: 'chat' })
export class ChatSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit(server: Server): any {
    console.log('[Chat Web-Socket Server Initialized.]');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('[connected]', socket.nsp.name);
    if (!memory[socket.nsp.name]) {
      memory[socket.nsp.name] = {};
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('[disconnected]', socket.nsp.name);
    delete memory[socket.nsp.name][socket.id];
  }

  @SubscribeMessage('join')
  handleJoinChatRoom(
    @MessageBody() data: { userId: number; chatRoomId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    memory[socket.nsp.name][socket.id] = data.userId;
    socket.join(`${data.chatRoomId}`);
  }

  @SubscribeMessage('leave')
  handleLeaveChatRoom(
    @MessageBody() data: { userId: number; chatRoomId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`${data.chatRoomId}`);
  }
}
