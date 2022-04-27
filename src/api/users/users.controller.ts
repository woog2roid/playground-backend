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

import { UsersService } from './users.service';

import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard, NotLoggedInGuard } from 'src/auth/is-logged-in.guards';

import { JoinRequestDto } from './dto/join-request.dto';

import { User } from '../../utils/request-user.decorator';
import { Users } from '../../entities/Users.entity';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '본인 정보 불러오기' })
  @ApiCookieAuth('connect.sid')
  @Get('/me')
  async getMyProfile(@User() user: Users) {
    if (user) {
      return user;
    } else {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
    }
  }

  @ApiOperation({ summary: 'id로 유저 검색' })
  @Get('/')
  async findById(@Query('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(NotLoggedInGuard)
  @Post('/join')
  async join(@Body() data: JoinRequestDto) {
    return this.usersService.join(data.id, data.nickname, data.password);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Delete('/quit')
  async delete(@User() user: Users) {
    return this.usersService.delete(user.id);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Post('/logout')
  async logout(@Response() res, @Request() req) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid', { httpOnly: true }).sendStatus(200);
    });
  }
}