import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/users.entity';

export class JoinRequestDto extends PickType(Users, ['id', 'password', 'nickname'] as const) {}
