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
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { ChatRooms } from './ChatRooms.entity';

@Entity({ schema: 'playground', name: 'chats' })
export class Chats {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'senderId', type: 'string' })
  senderId: string;

  @Column({ name: 'roomId', type: 'int' })
  roomId: number;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Column({ name: 'system', type: 'boolean' })
  system: boolean;

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
