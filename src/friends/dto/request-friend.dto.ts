import { PickType } from '@nestjs/swagger';
import { Users } from '../../users/entities/users.entity';

export class RequestFriendDto extends PickType(Users, ['id'] as const) {}
