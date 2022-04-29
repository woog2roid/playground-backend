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

@Entity({ schema: 'playground', name: 'chat_room_members' })
export class ChatRoomMembers {
  @PrimaryColumn({ name: 'id', type: 'int', unique: true })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ name: 'chatRoomId', type: 'int' })
  chatRoomId: number;

  @Column({ name: 'userId', type: 'varchar' })
  userId: string;

  @ManyToOne(() => ChatRooms, (chatRoom) => chatRoom.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'chatRoomId', referencedColumnName: 'id' }])
  chatRoom: ChatRooms;

  @ManyToOne(() => Users, (users) => users.chatRooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: Users;
}
