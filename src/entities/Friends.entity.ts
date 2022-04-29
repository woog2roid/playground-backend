import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users.entity';

@Entity({ schema: 'playground', name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'friend', type: 'boolean' })
  friend: boolean;

  @Column({ name: 'followerId', type: 'string' })
  followerId: string;

  @Column({ name: 'followingId', type: 'string' })
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.followers)
  @JoinColumn([{ name: 'followerId', referencedColumnName: 'id' }])
  follower: Users;

  @ManyToOne(() => Users, (user) => user.followings)
  @JoinColumn([{ name: 'followingId', referencedColumnName: 'id' }])
  following: Users;
}
