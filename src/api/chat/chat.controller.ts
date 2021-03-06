import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoggedInGuard } from 'src/auth/is-logged-in.guards';

import { User } from 'src/utils/request-user.decorator';
import { Users } from 'src/database/entities/Users.entity';

import { ChatService } from './chat.service';

import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { SendChatDto } from './dto/send-chat.dto';

@ApiTags('Chat')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('/chat-room')
export class ChatController {
  //후에 추가할 기능: 채팅방 나가기.
  constructor(private readonly chatsService: ChatService) {}

  @ApiOperation({
    summary: '모든 채팅방 불러오기(정렬 / 안 읽은 채팅 기능 추가)',
  })
  @Get('/')
  async getAllChatRoomsOrderedByLastChatWithUnreadCounts(@User() user: Users) {
    console.log('모든 채팅방 불러오기');
    return this.chatsService.getAllChatRoomsOrderedByLastChatWithUnreadCounts(
      user.id,
    );
  }

  @ApiOperation({ summary: '마지막으로 채팅방에 접속한 시간 기록하기' })
  @Post('/:id/last-read')
  async recordLastReadTimestamp(
    @User() user: Users,
    @Param('id') chatRoomId: number,
  ) {
    console.log('마지막으로 채팅방에 접속한 시간 기록하기');
    return this.chatsService.recordLastReadTimestamp(user.id, +chatRoomId);
  }

  @ApiOperation({ summary: '채팅방 생성하기' })
  @Post('/')
  async createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
    @Query('dm') isDm: boolean,
  ) {
    console.log('채팅방 생성하기');
    if (isDm) {
      return this.chatsService.createDmChatRoom(createChatRoomDto.members);
    } else {
      return this.chatsService.createGroupChatRoom(
        createChatRoomDto.members,
        createChatRoomDto.title,
      );
    }
  }

  @ApiOperation({ summary: '채팅방 멤버 불러오기' })
  @Get('/:id/member')
  async getChatRoomMembers(@Param('id') roomId: string) {
    console.log('채팅방 멤버 불러오기');
    return this.chatsService.getChatRoomMembers(+roomId);
  }

  @ApiOperation({ summary: '채팅방에 멤버 초대하기' })
  @Post('/:id/member')
  async inviteChatRoomMember(
    @Param('id') roomId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    console.log('채팅방에 멤버 초대하기');
    return this.chatsService.inviteChatRoomMember(
      +roomId,
      inviteMemberDto.members,
    );
  }

  @ApiOperation({ summary: '채팅방의 채팅 불러오기' })
  @Get('/:id/chat')
  async getChatRoomChats(
    @Param('id') roomId: string,
    @Query('page') page: string,
  ) {
    console.log('채팅방의 채팅 불러오기');
    return this.chatsService.getChatRoomChats(+roomId, +page);
  }

  @ApiOperation({ summary: '채팅방에 채팅 생성하기' })
  @Post('/:id/chat')
  async sendChatRoomChat(
    @Param('id') roomId: string,
    @Body() sendChatDto: SendChatDto,
    @User() user: Users,
  ) {
    console.log('채팅방에 채팅 생성하기');
    return this.chatsService.sendChatRoomChat(
      +roomId,
      user.id,
      sendChatDto.message,
    );
  }
}
