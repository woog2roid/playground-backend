import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Query,
  Response,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard, NotLoggedInGuard } from 'src/auth/is-logged-in.guards';

import { JoinRequestDto } from './dto/join-request.dto';

import { User } from '../../utils/request-user.decorator';
import { Users } from '../../database/entities/Users.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '본인 정보 불러오기' })
  @ApiCookieAuth('connect.sid')
  @Get('/me')
  async getMyProfile(@User() user: Users) {
    console.log('본인 정보 불러오기');
    if (user) {
      return user;
    } else {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
    }
  }

  @ApiOperation({ summary: '아이디로 유저 검색' })
  @Get('/')
  async findUserById(@Query('id') id: string) {
    console.log('아이디로 유저 검색');
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(NotLoggedInGuard)
  @Post('/join')
  async join(@Body() data: JoinRequestDto) {
    console.log('회원 가입');
    return this.userService.join(data.id, data.nickname, data.password);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Delete('/quit')
  async delete(@User() user: Users) {
    console.log('회원 탈퇴');
    return this.userService.delete(user.id);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: Users) {
    console.log('로그인');
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Post('/logout')
  async logout(@Response() res, @Request() req) {
    console.log('로그아웃');
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { httpOnly: true }).sendStatus(200);
    });
  }
}
