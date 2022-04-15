import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../users/entities/users.repository';
import { FriendsRepository } from './entities/friends.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, FriendsRepository])],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
