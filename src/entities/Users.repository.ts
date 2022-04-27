import { EntityRepository, Repository } from 'typeorm';
import { Users } from './Users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  findById(id: string) {
    return this.createQueryBuilder('users').where('users.id = :id', { id }).getOne();
  }
}
