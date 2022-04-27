import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../entities/Users.repository';
import { Friends } from '../../entities/Friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, Friends])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
