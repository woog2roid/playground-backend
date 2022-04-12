import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LoggedInGuard } from 'src/auth/is-logged-in.guards';

import { RequestFriendDto } from './dto/request-friend.dto';
import { AcceptFriendDto } from './dto/accept-frined.dto';

import { User } from '../utils/request-user.decorator';
import { Users } from '../users/entities/users.entity';
import { FriendsService } from './friends.service';
import { CancelRequestDto } from './dto/cancel-request.dto';

/*
들어가야 하는 라우터 목록
1. 내 친구 상태 보기 (친구, 요청대기, 수락대기) -> 다른 사람 건 못보는거로 ㅇㅇ
2. 친구 요청 걸기
2-1. 친구 요청 삭제 --> 요청을 잘못 건 경우 ㅇㅇ
3. 친구 요청 수락
4. 친구 삭제

following는 내가 팔로우 하는 (즉, 친구 요청은 걸었는데 수락은 못받은)
follwwer는 나를 팔로우 하는 (즉 나한테 친구 요청을 걸었는데 내가 수락 안한ㅇㅇ)

--> RESTFUL하게 짜려면, 어떻게...... uri에 동사를 안넣을 수 있을까
*/

@ApiTags('Friends')
@UseGuards(LoggedInGuard)
@Controller('/friend')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Get('/')
  async getAll(@User() user: Users) {
    return this.friendService.getAll(user);
  }

  @Post('/request')
  async request(@Body() requestFriendDto: RequestFriendDto, @User() user: Users) {
    return this.friendService.request(requestFriendDto, user);
  }

  @Delete('/request')
  async cancelRequest(@Body() cancelRequestDto: CancelRequestDto, @User() user: Users) {
    return this.friendService.cancelRequest(cancelRequestDto, user);
  }

  @Post('/accept')
  async accept(@Body() acceptFriendDto: AcceptFriendDto, @User() user: Users) {
    return this.friendService.accept(acceptFriendDto, user);
  }

  @Delete(':id')
  remove(@Param('id') targetId: string, @User() user: Users) {
    return this.friendService.remove(targetId, user);
  }
}
