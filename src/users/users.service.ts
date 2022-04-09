import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Users } from './entities/users.entity';
import { UsersRepository } from './entities/users.repository';

import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private connection: Connection) {}

  async findById(id: string) {
    const user = await this.usersRepository.findById(id).catch((err) => console.log(err));
    if (user) {
      return user;
    } else {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }

  async join(id: string, nickname: string, password: string) {
    //id가 겹치는 회원이 있는지 확인
    const exUser = await this.usersRepository.findById(id).catch((err) => console.log(err));
    if (exUser) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }

    //회원가입 SQL 쿼리
    const user = new Users();
    const hashedPassword = await bcrypt.hash(password, 12);
    user.id = id;
    user.nickname = nickname;
    user.password = hashedPassword;
    console.log(user);

    await this.usersRepository.save(user).catch((err) => {
      console.log(err);
    });
  }

  async delete(id: string) {
    await this.usersRepository.delete({ id }).catch((err) => {
      console.log(err);
    });
  }
}
