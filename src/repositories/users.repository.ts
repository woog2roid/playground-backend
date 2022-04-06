import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  findById(id: string) {
    return this.createQueryBuilder()
      .select('users.id')
      .addSelect('users.nickname')
      .from(Users, 'users')
      .where('users.id = :id', { id })
      .getOne();
  }
}
