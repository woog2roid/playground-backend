import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Users } from '../entities/Users.entity';

import bcrypt from 'bcrypt';

import * as dotenv from 'dotenv';
dotenv.config();

export class CreateInitialUserData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          id: process.env.ADMIN_ID,
          password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
          nickname: process.env.ADMIN_NICKNAME,
        },
      ])
      .execute();
  }
}
