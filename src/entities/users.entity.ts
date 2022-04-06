import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'playground', name: 'users' })
export class Users {
  @PrimaryColumn('varchar', { name: 'id', unique: true, length: 30 })
  id: string;

  @Column('varchar', { name: 'nickname', length: 50 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany((type) => Users)
  @JoinTable()
  friends: Users[];

  @ManyToMany((type) => Users)
  @JoinTable()
  followings: Users[];

  @ManyToMany((type) => Users)
  @JoinTable()
  followers: Users[];
}
