import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../database/entities/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
