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

@Entity({ schema: 'playground', name: 'chat_room_members' })
export class ChatRoomMembers {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ name: 'chatRoomId', type: 'int' })
  chatRoomId: number;

  //사람마다 같은 채팅방을 이름을 다 다르게 저장할 수 있도록!
  @Column({ name: 'chatRoomTitle', type: 'varchar' })
  chatRoomTitle: string;

  @Column({ name: 'memberId', type: 'varchar' })
  memberId: string;

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
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'id' }])
  member: Users;
}
