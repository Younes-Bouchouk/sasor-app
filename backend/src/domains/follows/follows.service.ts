import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { UserTokenData } from 'src/types/AuthUser';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowsService {
    constructor(private readonly prisma: PrismaService) {}
    async create(createFollowDto: CreateFollowDto, user: UserTokenData) {
        const existingFollower = await this.prisma.user.findUnique({
            where: { id: user.id },
        });
        if (!existingFollower)
            throw new BadRequestException("le compte du follower n'existe pas");
        const existingFollowing = await this.prisma.user.findUnique({
            where: { id: createFollowDto.followingId },
        });
        if (!existingFollowing)
            throw new BadRequestException("le compte à suivre n'existe pas");

        if (existingFollower.id === existingFollowing.id)
          throw new BadRequestException ("vous ne pouver pas suivre votre propre compte")

        const alreadyFollow = await this.prisma.follow.findFirst({
          where: {followingId: createFollowDto.followingId, followerId: user.id}
        });
        if (alreadyFollow)
          throw new BadRequestException ("vous suivez déja cet utilisateur")
        

        const newFollow = await this.prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: createFollowDto.followingId,
            },
        });
        return newFollow;
    }

    findAll() {
        return `This action returns all follows`;
    }

    findOne(id: number) {
        return `This action returns a #${id} follow`;
    }

    update(id: number, updateFollowDto: UpdateFollowDto) {
        return `This action updates a #${id} follow`;
    }

    remove(id: number) {
        return `This action removes a #${id} follow`;
    }
}
