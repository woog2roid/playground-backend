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
import { Chats } from './Chats.entity';
import { ChatRoomMembers } from './ChatRoomMembers.entity';

@Entity({ schema: 'playground', name: 'chat_rooms' })
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

  @OneToMany(
    () => ChatRoomMembers,
    (chatRoomMemeber) => chatRoomMemeber.chatRoomId,
  )
  members: ChatRoomMembers[];
}
