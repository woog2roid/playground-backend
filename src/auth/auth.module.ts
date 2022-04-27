import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';

import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';

@Module({
  imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([Users])],
  providers: [LocalStrategy, LocalSerializer],
})
export class AuthModule {}
