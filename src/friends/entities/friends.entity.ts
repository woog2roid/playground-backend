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

@Entity({ schema: 'playground', name: 'friend' })
export class Friends {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => Users, (users) => users.followings)
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followers)
  following: Users;

  @Column({ name: 'friend', type: 'boolean' })
  friend: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
