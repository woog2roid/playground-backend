import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Chats } from 'src/entities/Chats.entity';

export class SendChatDto extends PickType(Chats, ['message'] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  @ApiProperty({
    example: '안녕하세요?',
    description: '보낼 메세지',
  })
  public message: string;
}
