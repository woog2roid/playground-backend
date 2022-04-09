import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { Users } from '../users/entities/users.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection,
  ) {
    super();
  }

  serializeUser(user: Users, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOne({
        where: { id: userId },
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
