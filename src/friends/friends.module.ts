import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/entities/users.repository';
import { Friends } from './entities/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, Friends])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
