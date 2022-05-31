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
import { socketMemory as memory } from './socket-memory';

@WebSocketGateway({ namespace: 'chat' || 'game' })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit(server: Server): any {
    console.log('[Web-Socket Server Initialized.]');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
    if (!memory[socket.nsp.name]) {
      memory[socket.nsp.name] = {};
    }
  }

  /*
@SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }
  */

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
    delete memory[socket.nsp.name][socket.id];
  }
}
