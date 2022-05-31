import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../database/entities/Users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {
    super({ usernameField: 'id', passwordField: 'password' });
  }

  async validate(id: string, password: string, done: CallableFunction) {
    //id로 유저 DB 검색
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'password', 'nickname'],
    });
    if (!user) throw new UnauthorizedException();

    //비밀번호 확인
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) throw new UnauthorizedException();

    //비밀번호를 제외하고 serialize(id, nickname)
    const { password: pw, ...userInfo } = user;
    return done(null, userInfo);
  }
}
