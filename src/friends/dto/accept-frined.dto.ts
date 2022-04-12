import { PickType } from '@nestjs/swagger';
import { Users } from '../../users/entities/users.entity';

export class AcceptFriendDto extends PickType(Users, ['id'] as const) {}
