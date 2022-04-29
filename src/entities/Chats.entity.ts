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
import { ChatRooms } from './ChatRooms.entity';

@Entity({ schema: 'playground', name: 'chats' })
export class Chats {
  @PrimaryColumn({ name: 'id', type: 'int', unique: true })
  id: number;

  @Column({ name: 'senderId', type: 'string' })
  senderId: string;

  @Column({ name: 'roomId', type: 'string' })
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.chats)
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  sender: Users;

  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.chats)
  @JoinColumn([{ name: 'roomId', referencedColumnName: 'id' }])
  room: ChatRooms;
}
