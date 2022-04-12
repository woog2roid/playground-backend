import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { RequestFriendDto } from './dto/request-friend.dto';
import { AcceptFriendDto } from './dto/accept-frined.dto';

import { Connection, Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { Friends } from './entities/friends.entity';
import { UsersRepository } from '../users/entities/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CancelRequestDto } from './dto/cancel-request.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    private usersRepository: UsersRepository,
    private connection: Connection,
  ) {}

  async getAll(user: Users) {
    //쿼리빌더를 이용해서 join 후에 find해야 할 듯....
    const joinedFriendTable = await this.friendsRepository
      .createQueryBuilder('friend')
      .leftJoin('friend.follower', 'follower')
      .leftJoin('friend.following', 'following')
      .select(['friend.id', 'follower.id', 'follower.nickname', 'following.id', 'following.nickname', 'friend']);

    const friends = await joinedFriendTable
      .where('friend.friend = :isFriend', { isFriend: true })
      .andWhere('friend.follower = :id', { id: user.id })
      .getMany();

    const followings = await joinedFriendTable
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.follower = :id', { id: user.id })
      .getMany();

    const followers = await joinedFriendTable
      .where('friend.friend = :isFriend', { isFriend: false })
      .andWhere('friend.following = :id', { id: user.id })
      .getMany();

    const data = { friends, followings, followers };
    return data;
  }

  async request(requestFriendDto: RequestFriendDto, follower: Users) {
    const followingId = requestFriendDto.id;

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

    const request = new Friends();
    request.follower = follower;
    request.following = following;
    request.friend = false;
    await this.friendsRepository.save(request);
  }

  async cancelRequest(cancelRequestDto: CancelRequestDto, user: Users) {
    const followingId = cancelRequestDto.id;

    const requestData = await this.friendsRepository.findOne({
      where: { following: followingId, follower: user.id, friend: false },
    });
    if (!requestData) {
      throw new NotFoundException('존재하지 않는 친구요청에 대한 요청입니다.');
    }

    await this.friendsRepository.delete(requestData);
  }

  async accept(acceptFriendDto: AcceptFriendDto, following: Users) {
    const followerId = acceptFriendDto.id;
    const requestData = await this.friendsRepository.findOne({
      where: { following: following.id, follower: followerId, friend: false },
    });
    if (!requestData) {
      throw new NotFoundException('존재하지 않는 친구요청에 대한 응답입니다.');
    }

    requestData.friend = true;
    await this.friendsRepository.save(requestData);

    const inverseData = new Friends();
    inverseData.following = requestData.follower;
    inverseData.follower = requestData.following;
    inverseData.friend = true;
    await this.friendsRepository.save(inverseData);
  }

  async remove(targetId: string, user: Users) {
    const target = await this.usersRepository.findById(targetId).catch((err) => console.log(err));
    if (!target) {
      throw new NotFoundException('존재하지 않는 사용자에 대한 요청입니다.');
    }

    await this.friendsRepository.delete({ follower: target, following: user }).catch((err) => {
      console.log(err);
    });
    await this.friendsRepository.delete({ following: target, follower: user }).catch((err) => {
      console.log(err);
    });
  }
}
