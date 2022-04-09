import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';

/*
서로 맞팔이 되어있으면, 친구'friend'라고 부른다.

그게 아니라면,
following는 내가 팔로우 하는 (즉, 친구 요청은 걸었는데 수락은 못받은)
follwwer는 나를 팔로우 하는 (즉 나한테 친구 요청을 걸었는데 내가 수락 안한ㅇㅇ)
*/

@Entity({ schema: 'playground', name: 'friend-requests' })
export class Friends {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => Users, (users) => users.followings)
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followers)
  following: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
