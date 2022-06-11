import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomMembers } from 'src/database/entities/ChatRoomMembers.entity';
import { ChatRooms } from 'src/database/entities/ChatRooms.entity';
import { Chats } from 'src/database/entities/Chats.entity';
import { Users } from 'src/database/entities/Users.entity';

import { ChatSocketGateway } from '../../socket/chat-socket.gateway';
import { ConfigService } from '@nestjs/config';

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
    private readonly chatSocketGateway: ChatSocketGateway,
    private readonly config: ConfigService,
  ) {}

  async getAllChatRooms(memberId: string) {
    //getChatRoom
    const chatRooms = await this.chatRoomMembersRepository
      .createQueryBuilder('chatRoomMembers')
      .select([
        'chatRoomMembers.chatRoomId AS id',
        'chatRoomMembers.chatRoomTitle AS title',
      ])
      .where('chatRoomMembers.memberId = :memberId', { memberId })
      .getRawMany();

    //getChatRoomsLastChatTimeStamp
    const chatRoomsSortedByChat = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const chatRoomId = chatRoom.id;
        const lastChat = await this.chatsRepository
          .createQueryBuilder('chats')
          .select(['chats.createdAt AS timeStamp'])
          .where('chats.roomId = :chatRoomId', { chatRoomId })
          .orderBy('chats.createdAt', 'DESC')
          .take(1)
          .getRawOne();

        const chatRoomWithLastChatTimestamp = chatRoom;
        chatRoomWithLastChatTimestamp.lastChatTimeStamp = lastChat?.timeStamp;

        return chatRoomWithLastChatTimestamp;
      }),
    );

    //sortChatRoomByLastChat
    chatRoomsSortedByChat.sort((a, b) => {
      const dateA = new Date(a.lastChatTimeStamp).getTime();
      const dateB = new Date(b.lastChatTimeStamp).getTime();
      return dateA < dateB ? 1 : -1;
    });

    return chatRoomsSortedByChat;
  }

  async sendSystemChat(chatRoomId: number, message: string) {
    const newChat = new Chats();
    newChat.senderId = this.config.get('ADMIN_ID');
    newChat.roomId = chatRoomId;
    newChat.message = message;
    newChat.system = true;
    const savedChat = await this.chatsRepository.save(newChat);
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
    chatRoomMembers1.memberId = member1.id;
    chatRoomMembers1.chatRoomTitle = `${member2.nickname}님`;
    await this.chatRoomMembersRepository.save(chatRoomMembers1);

    const chatRoomMembers2 = new ChatRoomMembers();
    chatRoomMembers2.chatRoomId = savedChatRoom.id;
    chatRoomMembers2.memberId = member2.id;
    chatRoomMembers2.chatRoomTitle = `${member1.nickname}님`;
    await this.chatRoomMembersRepository.save(chatRoomMembers2);

    await this.sendSystemChat(savedChatRoom.id, '채팅방이 생성되었습니다.');
  }

  async createGroupChatRoom(members: string[], title: string) {
    console.log(members, title);
    const chatRoom = new ChatRooms();
    const savedChatRoom = await this.chatRoomsRepository.save(chatRoom);
    console.log(savedChatRoom);

    for (const membersId of members) {
      const chatRoomMembers = new ChatRoomMembers();
      chatRoomMembers.chatRoomId = savedChatRoom.id;
      chatRoomMembers.memberId = membersId;
      chatRoomMembers.chatRoomTitle = title;
      await this.chatRoomMembersRepository.save(chatRoomMembers);
    }

    await this.sendSystemChat(savedChatRoom.id, '채팅방이 생성되었습니다.');
  }

  async getChatRoomMembers(chatRoomId: number) {
    const chatRoomMembers = await this.chatRoomMembersRepository
      .createQueryBuilder('chatRoomMembers')
      .innerJoin('chatRoomMembers.member', 'member')
      .select(['member.id AS id', 'member.nickname AS nickname'])
      .where('chatRoomMembers.chatRoomId = :chatRoomId', { chatRoomId })
      .getRawMany();

    return chatRoomMembers;
  }

  async inviteChatRoomMember(chatRoomId: number, members: string[]) {
    for (const membersId of members) {
      const chatRoomMembers = new ChatRoomMembers();
      chatRoomMembers.chatRoomId = chatRoomId;
      chatRoomMembers.memberId = membersId;
      await this.chatRoomMembersRepository.save(chatRoomMembers);
    }

    await this.sendSystemChat(chatRoomId, '새로운 멤버를 초대하였습니다.');
  }

  async getChatRoomChats(chatRoomId: number, page: number) {
    return this.chatsRepository
      .createQueryBuilder('chats')
      .innerJoin('chats.room', 'room', 'room.id = :chatRoomId', {
        chatRoomId,
      })
      .innerJoinAndSelect('chats.sender', 'sender')
      .orderBy('chats.createdAt', 'DESC')
      .take(100)
      .skip(100 * (page - 1))
      .getMany();
  }

  async sendChatRoomChat(
    chatRoomId: number,
    senderId: string,
    message: string,
  ) {
    const newChat = new Chats();
    newChat.senderId = senderId;
    newChat.roomId = chatRoomId;
    newChat.message = message;
    newChat.system = false;
    const savedChat = await this.chatsRepository.save(newChat);

    const chatWithInfo = await this.chatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['sender', 'room'],
    });

    this.chatSocketGateway.server
      .to(`${chatWithInfo.roomId}`)
      .emit('message', chatWithInfo);
  }
}
