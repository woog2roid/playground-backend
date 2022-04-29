import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoggedInGuard } from 'src/auth/is-logged-in.guards';

import { User } from 'src/utils/request-user.decorator';
import { Users } from 'src/entities/Users.entity';

import { ChatsService } from './chats.service';

import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { SendChatDto } from './dto/send-chat.dto';

/*
- 모든 채팅방 불러오기
// - 특정 채팅방 불러오기 (?) 이건 검색기능에 필요할듯..?
- 채팅방 만들기
- 채팅방 내에 멤버 가져오기
- 채팅방 내에 멤버 추가하기
- 채팅방의 채팅 가져오기
- 채팅방에 채팅 생성하기
*/

@ApiTags('Chat')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('/chat-room')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @ApiOperation({ summary: '모든 채팅방 불러오기' })
  @Get('/')
  getAllChatRooms(@User() user: Users) {
    return this.chatsService.getAllChatRooms(user.id);
  }

  @ApiOperation({ summary: '채팅방 생성하기' })
  @Post('/')
  createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatsService.createChatRoom(
      createChatRoomDto.title,
      createChatRoomDto.members,
    );
  }

  @ApiOperation({ summary: '채팅방 멤버 불러오기' })
  @Get('/:id/member')
  getChatRoomMembers(@Param('id') roomId: string) {
    return this.chatsService.getChatRoomMembers(+roomId);
  }

  @ApiOperation({ summary: '채팅방에 멤버 초대하기' })
  @Post('/:id/member')
  //DTO: 초대할 멤버들의 id
  inviteChatRoomMember(
    @Param('id') roomId: string,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.chatsService.inviteChatRoomMember(
      +roomId,
      inviteMemberDto.members,
    );
  }

  @ApiOperation({ summary: '채팅방의 채팅 불러오기' })
  @Get('/:id/chat')
  getChatRoomChats(@Param('id') roomId: string) {
    return this.chatsService.getChatRoomChats(+roomId);
  }

  @ApiOperation({ summary: '채팅방에 채팅 생성하기' })
  //DTO: 채팅 내용
  @Post('/:id/chat')
  sendChatRoomChat(
    @Param('id') roomId: string,
    @Body() sendChatDto: SendChatDto,
  ) {
    return this.chatsService.getChatRoomChats(+roomId, sendChatDto.message);
  }
}
