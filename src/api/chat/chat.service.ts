import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomMembers } from 'src/entities/ChatRoomMembers.entity';
import { ChatRooms } from 'src/entities/ChatRooms.entity';
import { Chats } from 'src/entities/Chats.entity';
import { Users } from 'src/entities/Users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chats)
    private chatsRepository: Repository<Chats>,
    @InjectRepository(ChatRooms)
    private chatRoomsRepository: Repository<ChatRooms>,
    @InjectRepository(ChatRoomMembers)
    private chatRoomMembersRepository: Repository<ChatRoomMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllChatRooms(userId: string) {
    const chatRooms = await this.chatRoomMembersRepository.find({
      where: { userId },
      select: ['chatRoomId', 'chatRoomTitle'],
    });

    return chatRooms;
  }

  async createDmChatRoom(members: string[]) {
    const chatRoom = new ChatRooms();
    const savedChatRoom = await this.chatRoomsRepository.save(chatRoom);
    console.log(savedChatRoom);

    if (members.length !== 2) {
      throw new BadRequestException('1:1 채팅방 요청 형식이 아닙니다.');
    }

    const member1 = await this.usersRepository.findOne({
      where: { id: members[0] },
    });
    const member2 = await this.usersRepository.findOne({
      where: { id: members[1] },
    });

    const chatRoomMembers1 = new ChatRoomMembers();
    chatRoomMembers1.chatRoomId = savedChatRoom.id;
    chatRoomMembers1.userId = member1.id;
    chatRoomMembers1.chatRoomTitle = `${member2.nickname}님`;
    await this.chatRoomMembersRepository.save(chatRoomMembers1);

    const chatRoomMembers2 = new ChatRoomMembers();
    chatRoomMembers2.chatRoomId = savedChatRoom.id;
    chatRoomMembers2.userId = member2.id;
    chatRoomMembers2.chatRoomTitle = `${member1.nickname}님`;
    await this.chatRoomMembersRepository.save(chatRoomMembers2);
  }

  async createGroupChatRoom(members: string[], title: string) {
    const chatRoom = new ChatRooms();
    const savedChatRoom = await this.chatRoomsRepository.save(chatRoom);
    console.log(savedChatRoom);

    for (const membersId of members) {
      const chatRoomMembers = new ChatRoomMembers();
      chatRoomMembers.chatRoomId = savedChatRoom.id;
      chatRoomMembers.userId = membersId;
      chatRoomMembers.chatRoomTitle = title;
      await this.chatRoomMembersRepository.save(chatRoomMembers);
    }
  }

  async getChatRoomMembers(chatRoomId: number) {
    const chatRoomMembers = await this.chatRoomMembersRepository
      .createQueryBuilder('chatRoomMembers')
      .innerJoin('chatRoomMembers.user', 'user')
      .select(['user.id', 'user.nickname'])
      .where('chatRoomMemebers.chatRoomId = :chatRoomId', { chatRoomId })
      .getMany();

    return chatRoomMembers;
  }

  async inviteChatRoomMember(chatRoomId: number, members: string[]) {
    for (const membersId of members) {
      const chatRoomMembers = new ChatRoomMembers();
      chatRoomMembers.chatRoomId = chatRoomId;
      chatRoomMembers.userId = membersId;
      await this.chatRoomMembersRepository.save(chatRoomMembers);
    }
  }

  async getChatRoomChats(chatRoomId: number) {
    //채팅방의 채팅 불러오기
  }

  async sendChatRoomChat(chatRoomId: number, message: string) {
    //채팅방에 채팅 생성하기
  }
}
