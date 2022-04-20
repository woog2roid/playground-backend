import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Friends } from './entities/friends.entity';
import { UsersRepository } from '../users/entities/users.repository';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private usersRepository: UsersRepository,
  ) {}

  async getAll(user: Users) {
    const table = await this.friendsRepository
      .createQueryBuilder('friend')
      .innerJoin('friend.follower', 'follower')
      .innerJoin('friend.following', 'following')
      .select(['friend.id', 'follower.id', 'follower.nickname', 'following.id', 'following.nickname', 'friend.friend']);

    const friends = await table
      .where('friend.friend = :isFriend', { isFriend: true })
      .andWhere('friend.follower = :id', { id: user.id })
      .getMany();

    const followings = await table
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.follower = :id', { id: user.id })
      .getMany();

    const followers = await table
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.following = :id', { id: user.id })
      .getMany();

    const data = { friends, followings, followers };
    return data;
  }

  async request(followingId: string, follower: Users) {
    const following = await this.usersRepository.findById(followingId).catch((err) => console.log(err));
    if (!following) {
      throw new NotFoundException('존재하지 않는 사용자에게 친구요청 하였습니다.');
    }

    const exRequest = await this.friendsRepository.findOne({
      where: { follower: follower.id, following: followingId },
    });
    if (exRequest) {
      throw new NotAcceptableException('이미 요청하셨거나, 이미 친구인 회원입니다.');
    }

    const inverseRequest = await this.friendsRepository.findOne({
      where: { follower: followingId, following: follower.id },
    });
    if (inverseRequest) {
      throw new NotAcceptableException('상대방이 친구 요청을 이미 보냈습니다.');
    }

    if (followingId === follower.id) {
      throw new NotAcceptableException('자기 자신에게는 친구요청을 할 수 없습니다.');
    }

    const request = new Friends();
    request.follower = follower;
    request.following = following;
    request.friend = false;
    return this.friendsRepository.save(request);
  }

  async cancelRequest(relation: string, targetId: string, user: Users) {
    if (relation === 'follower') {
      const requestData = await this.friendsRepository.findOne({
        where: { following: user.id, follower: targetId, friend: false },
      });
      if (!requestData) {
        throw new NotFoundException('존재하지 않는 친구요청에 대한 요청입니다.');
      }
      return this.friendsRepository.delete({ id: requestData.id });
    } else if (relation === 'following') {
      const requestData = await this.friendsRepository.findOne({
        where: { following: targetId, follower: user.id, friend: false },
      });
      if (!requestData) {
        throw new NotFoundException('존재하지 않는 친구요청에 대한 요청입니다.');
      }
      return this.friendsRepository.delete({ id: requestData.id });
    }
  }

  async accept(followerId: string, following: Users) {
    const requestData = await this.friendsRepository
      .createQueryBuilder('friends')
      .innerJoinAndSelect('friends.follower', 'follower', 'follower.id = :followerId', { followerId })
      .getOne();
    if (!requestData) {
      throw new NotFoundException('존재하지 않는 친구요청에 대한 응답입니다.');
    }

    requestData.friend = true;
    await this.friendsRepository.save(requestData);

    const inverseData = new Friends();
    inverseData.following = requestData.follower;
    inverseData.follower = following;
    inverseData.friend = true;
    await this.friendsRepository.save(inverseData);
  }

  async remove(targetId: string, user: Users) {
    const target = await this.usersRepository.findById(targetId).catch((err) => console.log(err));
    if (!target) {
      throw new NotFoundException('존재하지 않는 사용자에 대한 요청입니다.');
    }

    this.friendsRepository.delete({ follower: target, following: user }).catch((err) => {
      console.log(err);
    });
    this.friendsRepository.delete({ following: target, follower: user }).catch((err) => {
      console.log(err);
    });
  }
}
