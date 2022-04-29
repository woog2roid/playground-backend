import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsString,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { ChatRooms } from 'src/entities/ChatRooms.entity';

export class CreateChatRoomDto extends PickType(ChatRooms, ['title'] as const) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '테스트용 채팅방',
    description: '채팅방 이름',
  })
  public title: string;

  @IsArray()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    example: ['test1', 'test2'],
    description: '채팅방 최초 생성 시 초대될 유저의 아이디',
  })
  public members: string[];
}
