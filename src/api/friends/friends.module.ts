import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities/Users.entity';
import { Friends } from '../../entities/Friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
