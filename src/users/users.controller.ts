import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Query,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoinRequestDto } from './dto/join-request.dto';
import { UsersService } from './users.service';

//들어가야 하는 컨트롤러 목록
/*
1. find by id

3. 회원가입
4. 회원탈퇴

5. 로그인
6. 로그아웃
*/

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
}
