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
            throw new BadRequestException(
                'vous ne pouver pas suivre votre propre compte',
            );

        const alreadyFollow = await this.prisma.follow.findFirst({
            where: {
                followingId: createFollowDto.followingId,
                followerId: user.id,
            },
        });
        if (alreadyFollow)
            throw new BadRequestException('vous suivez déja cet utilisateur');

        const newFollow = await this.prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: createFollowDto.followingId,
            },
        });
        return newFollow;
    }

    findMyFollowers(user: UserTokenData) {
        return this.prisma.follow.findMany({
            where: {
                followingId: user.id,
            },
            include: {
                follower: {
                    select: { pseudo: true },
                },
            },
        });
    }

    findMyFollowing(user: UserTokenData) {
        return this.prisma.follow.findMany({
            where: {
                followerId: user.id,
            },
            include: {
                following: {
                    select: { pseudo: true },
                },
            },
        });
    }

    findUserFollowers(userId) {
        return this.prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    select: { pseudo: true },
                },
            },
        });
    }

    findUserFollowing(userId) {
        return this.prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: { pseudo: true },
                },
            },
        });
    }

    async remove(deleteFollowDto, user: UserTokenData) {
        const Follow = await this.prisma.follow.findFirst({
            where: {
                followingId: deleteFollowDto.followingId,
                followerId: user.id,
            },
        });
        if (!Follow)
            throw new BadRequestException('Vous ne suiver pas ce compte');
        const deletefollow = await this.prisma.follow.delete({
            where: {
                id: Follow.id,
            },
        });
        return 'vous ne suiver plus ce compte';
    }
}
