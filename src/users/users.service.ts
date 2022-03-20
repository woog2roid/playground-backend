import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'nickname'],
    });
    if (user) {
      return user;
    } else {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }

  async join(id: string, nickname: string, password: string) {
    //id가 겹치는 회원이 있는지 확인
    const exUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (exUser) {
      throw new ForbiddenException('이미 존재하는 사용자입니다');
    }

    //회원가입
    const user = new Users();
    const hashedPassword = await bcrypt.hash(password, 12);
    user.id = id;
    user.nickname = nickname;
    user.password = hashedPassword;
    console.log(user);

    await this.usersRepository.save(user);
  }
}
