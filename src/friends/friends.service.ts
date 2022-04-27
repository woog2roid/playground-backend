import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from './entities/friends.entity';
import { UsersRepository } from '../users/entities/users.repository';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private usersRepository: UsersRepository,
  ) {}

  async getAll(userId: string) {
    const table = await this.friendsRepository
      .createQueryBuilder('friend')
      .innerJoin('friend.follower', 'follower')
      .innerJoin('friend.following', 'following')
      .select(['friend.id', 'follower.id', 'follower.nickname', 'following.id', 'following.nickname', 'friend.friend']);

    const friends = await table
      .where('friend.friend = :isFriend', { isFriend: true })
      .andWhere('friend.follower = :userId', { userId })
      .getMany();

    const followings = await table
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.follower = :userId', { userId })
      .getMany();

    const followers = await table
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.following = :userId', { userId })
      .getMany();

    const data = { friends, followings, followers };
    return data;
  }

  async request(followingId: string, followerId: string) {
    const followingUser = await this.usersRepository.findById(followingId).catch((err) => console.log(err));
    if (!followingUser) {
      throw new NotFoundException('존재하지 않는 사용자에게 친구요청 하였습니다.');
    }

    const exRequest = await this.friendsRepository.findOne({
      where: { followerId, followingId },
    });
    if (exRequest) {
      throw new NotAcceptableException('이미 요청하셨거나, 이미 친구인 회원입니다.');
    }

    const inverseRequest = await this.friendsRepository.findOne({
      where: { followerId: followingId, followingId: followerId, friend: false },
    });
    if (inverseRequest) {
      throw new NotAcceptableException('상대방이 친구 요청을 이미 보냈습니다.');
    }

    if (followingId === followerId) {
      throw new NotAcceptableException('자기 자신에게는 친구요청을 할 수 없습니다.');
    }

    const request = new Friends();
    request.followerId = followerId;
    request.followingId = followingId;
    request.friend = false;
    await this.friendsRepository.save(request);
  }

  async cancelRequest(followerId: string, followingId: string) {
    const requestData = await this.friendsRepository.findOne({
      where: { followingId, followerId, friend: false },
    });
    if (!requestData) {
      throw new NotFoundException('존재하지 않는 친구요청에 대한 요청입니다.');
    }
    await this.friendsRepository.delete({ id: requestData.id });
  }

  async accept(followerId: string, followingId: string) {
    const requestData = await this.friendsRepository.findOne({ where: { followerId, followingId, friend: false } });
    if (!requestData) {
      throw new NotFoundException('존재하지 않는 친구요청에 대한 응답입니다.');
    }

    requestData.friend = true;
    await this.friendsRepository.save(requestData);

    const inverseData = new Friends();
    inverseData.followingId = followerId;
    inverseData.followerId = followingId;
    inverseData.friend = true;
    await this.friendsRepository.save(inverseData);
  }

  async remove(targetId: string, userId: string) {
    const targetUser = await this.usersRepository.findById(targetId).catch((err) => console.log(err));
    if (!targetUser) {
      throw new NotFoundException('존재하지 않는 사용자에 대한 요청입니다.');
    }

    this.friendsRepository.delete({ followerId: targetId, followingId: userId }).catch((err) => {
      console.log(err);
    });
    this.friendsRepository.delete({ followingId: targetId, followerId: userId }).catch((err) => {
      console.log(err);
    });
  }
}
