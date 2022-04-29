import { PickType } from '@nestjs/swagger';
import { Users } from '../../../entities/Users.entity';

export class RequestFriendDto extends PickType(Users, ['id'] as const) {}
