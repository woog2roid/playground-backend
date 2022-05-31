import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../database/entities/Users.entity';

import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {}

  async findUserById(id: string) {
    const user = await this.usersRepository
      .findOne({ where: { id } })
      .catch((err) => console.log(err));
    if (user) {
      return user;
    } else {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
  }

  async join(id: string, nickname: string, password: string) {
    const exUser = await this.usersRepository
      .findOne({ where: { id } })
      .catch((err) => console.log(err));
    if (exUser) {
      throw new ForbiddenException('이미 존재하는 사용자입니다.');
    }

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
