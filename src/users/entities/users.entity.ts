import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Friends } from '../../friends/entities/friends.entity';

@Entity({ schema: 'playground', name: 'users' })
export class Users {
  @PrimaryColumn({ name: 'id', type: 'varchar', unique: true, length: 30 })
  id: string;

  @Column({ name: 'nickname', type: 'varchar', length: 50 })
  nickname: string;

  @Column({ name: 'password', type: 'varchar', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  //relations, from here.
  @OneToMany(() => Friends, (follow) => follow.following)
  followings: Friends[];

  @OneToMany(() => Friends, (follow) => follow.follower)
  followers: Friends[];
}
