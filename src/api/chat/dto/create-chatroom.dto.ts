import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize, MaxLength } from 'class-validator';

export class CreateChatRoomDto {
  @IsString()
  @ApiProperty({
    example: '테스트용 채팅방',
    description: '채팅방 이름, 개인채팅방 생성 시에는 필요 없음.',
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
