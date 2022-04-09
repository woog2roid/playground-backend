import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Query,
  Response,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard, NotLoggedInGuard } from 'src/auth/is-logged-in.guards';

import { JoinRequestDto } from './dto/join-request.dto';
import { User } from '../utils/request-user.decorator';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '본인 정보 불러오기' })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @Get('/me')
  async getMyProfile(@User() user: Users) {
    return user;
  }

  @ApiOperation({ summary: 'id로 유저 검색' })
  @UseGuards(LoggedInGuard)
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
  @UseGuards(LoggedInGuard)
  @Delete('/quit')
  async delete(@User() user: Users) {
    return this.usersService.delete(user.id);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: Users) {
    //Passport의 local-auth guard에서 session 처리까지 해주기 때문에
    //따로 service 구현없이 user만 return한다.
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
