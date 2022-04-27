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

@WebSocketGateway({ namespace: /\/ws-.+/ })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  //afterInit, handdle Connection, disconnection 등은 이미
  //만들어져있는 친구들이라 따로 @SubscirbeMessage가 없어도 되는거고
  //그 외의 것들에 반응하려면 SubscribeMessage안에 message 넣어줘야함
  //예시
  /*
  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }
  */

  afterInit(server: Server): any {
    console.log('server Initialized.');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('connected', socket.nsp.name);
    if (!memory[socket.nsp.name]) {
      memory[socket.nsp.name] = {};
    }
    // broadcast to all clients in the given sub-namespace
    //socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket.nsp.name);
    delete memory[socket.nsp.name][socket.id];
    //const newNamespace = socket.nsp;
    //newNamespace.emit('onlineList', Object.values(memory[socket.nsp.name]));
  }
}
