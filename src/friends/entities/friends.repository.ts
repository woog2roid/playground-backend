import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Friends } from './friends.entity';

@EntityRepository(Friends)
export class FriendsRepository extends Repository<Friends> {
  findOneWithUsersInfo(followerId: string, followingId: string, friend: boolean) {
    return this.createQueryBuilder('friend')
      .leftJoin('friend.follower', 'follower')
      .leftJoin('friend.following', 'following')
      .select(['friend.id', 'follower.id', 'follower.nickname', 'following.id', 'following.nickname', 'friend'])
      .where('follower.id = :followerId', { followerId })
      .andWhere('following.id = :followingId', { followingId })
      .andWhere('friend.friend = :friend', { friend })
      .getOne();
  }
}
