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
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JoinRequestDto } from './dto/join-request.dto';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { User } from '../utils/request-user.decorator';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'id로 유저 검색' })
  @Get('/')
  async findById(@Query('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post('/join')
  async join(@Body() data: JoinRequestDto) {
    return this.usersService.join(data.id, data.nickname, data.password);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete('/quit/:id')
  delete(@Param('id') id: string) {
    return '회원탈퇴';
    //return this.usersService.delete(+id, updateUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User() user: Users) {
    //Passport의 local-auth guard에서 session 처리까지 해주기 때문에
    //따로 service 구현없이 user만 return한다.
    return user;
  }

  //@ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  //@UseGuards(LoggedInGuard)
  @Post('logout')
  async logout(@Response() res) {
    return '로그아웃';
    /*
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
    */
  }
}
