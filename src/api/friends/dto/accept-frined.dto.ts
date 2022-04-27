import { PickType } from '@nestjs/swagger';
import { Users } from '../../../entities/Users.entity';

export class AcceptFriendDto extends PickType(Users, ['id'] as const) {}
