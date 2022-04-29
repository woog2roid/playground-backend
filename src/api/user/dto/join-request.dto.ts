import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Users } from '../../../entities/Users.entity';

export class JoinRequestDto extends PickType(Users, [
  'id',
  'password',
  'nickname',
] as const) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test12345',
    description: '아이디',
  })
  public id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '**********',
    description: '비밀번호',
  })
  public password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '테스트 계정',
    description: '닉네임',
  })
  public nickname: string;
}
