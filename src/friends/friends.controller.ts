import { Controller, Get, Post, Body, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FriendsService } from './friends.service';

import { LoggedInGuard } from 'src/auth/is-logged-in.guards';

import { RequestFriendDto } from './dto/request-friend.dto';
import { AcceptFriendDto } from './dto/accept-frined.dto';

import { User } from '../utils/request-user.decorator';
import { Users } from '../users/entities/users.entity';

@ApiTags('Friends')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('/friend')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @ApiOperation({ summary: '모든 친구 관계 불러오기' })
  @Get('/')
  async getAll(@User() user: Users) {
    return this.friendService.getAll(user);
  }

  @ApiOperation({ summary: '친구 요청 보내기' })
  @Post('/request')
  async request(@Body() requestFriendDto: RequestFriendDto, @User() user: Users) {
    return this.friendService.request(requestFriendDto.id, user);
  }

  @ApiOperation({ summary: '친구 요청 거절 및 친구 요청 취소' })
  @Delete('/request')
  async cancelRequest(@Query('relation') relation: string, @Query('id') targetId: string, @User() user: Users) {
    return this.friendService.cancelRequest(relation, targetId, user);
  }

  @ApiOperation({ summary: '친구 요청 수락' })
  @Post('/accept')
  async accept(@Body() acceptFriendDto: AcceptFriendDto, @User() user: Users) {
    return this.friendService.accept(acceptFriendDto.id, user);
  }

  @ApiOperation({ summary: '친구 삭제' })
  @Delete('/')
  remove(@Query('id') targetId: string, @User() user: Users) {
    return this.friendService.remove(targetId, user);
  }
}
