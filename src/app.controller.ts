import { Controller, Get, Response } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/')
export class AppController {
  @ApiOperation({ summary: '서버 상태 확인' })
  @Get('/')
  async sendOk() {
    console.log('서버 상태 확인');
    return;
  }
}
