import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { Chats } from './Chats.entity';

@Entity({ schema: 'playground', name: 'ChatRoom' })
export class ChatRooms {
  @PrimaryColumn({ name: 'id', type: 'int', unique: true })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Chats, (chat) => chat.roomId)
  chats: Chats[];

  @ManyToMany(() => Users, (user) => user.chatRooms)
  members: Users[];
}
