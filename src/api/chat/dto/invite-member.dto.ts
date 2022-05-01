import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize, MaxLength } from 'class-validator';

export class InviteMemberDto {
  @IsArray()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    example: ['test1', 'test2'],
    description: '초대할 유저의 아이디',
  })
  public members: string[];
}
