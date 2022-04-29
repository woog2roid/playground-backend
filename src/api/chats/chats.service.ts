import { Injectable } from '@nestjs/common';
import { ChatRoomMembers } from 'src/entities/ChatRoomMembers.entity';

@Injectable()
export class ChatsService {
  getAllChatRooms(userId: string) {
    //모든 채팅방 불러오기
  }

  createChatRoom(title: string, members: string[]) {
    //채팅방 생성하기
  }

  getChatRoomMembers(chatRoomId: number) {
    //채팅방 멤버 불러오기
  }

  inviteChatRoomMember(chatRoomId: number, members: string[]) {
    //채팅방에 멤버 초대하기
  }

  getChatRoomChats(chatRoomId: number) {
    //채팅방의 채팅 불러오기
  }

  sendChatRoomChat(chatRoomId: number, message: string) {
    //채팅방에 채팅 생성하기
  }
}
