import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { Friends } from '../../entities/Friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
