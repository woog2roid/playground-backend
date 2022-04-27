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
import { Friends } from './Friends.entity';
import { Chats } from './Chats.entity';
import { ChatRooms } from './ChatRooms.entity';

@Entity({ schema: 'playground', name: 'Users' })
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

  @OneToMany(() => Friends, (friend) => friend.following)
  followings: Friends[];

  @OneToMany(() => Friends, (friend) => friend.follower)
  followers: Friends[];

  @OneToMany(() => Chats, (chat) => chat.sender)
  chats: Chats[];

  @ManyToMany(() => ChatRooms, (chatRoom) => chatRoom.members)
  chatRooms: ChatRooms[];
}
