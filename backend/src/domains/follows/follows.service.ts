import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UserTokenData } from 'src/types/AuthUser';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowsService {
    constructor(private readonly prisma: PrismaService) {}

    /*
     * Permet de suivre un autre utilisateur
     * Vérifie si les utilisateurs existent
     * Vérifie si les utilisateurs sont différents
     * Vérifie que l'utilisateur le suis déjà'
     * puis insère le suivis dans la table 'follow'
     */
    async create(createFollowDto: CreateFollowDto, user: UserTokenData) {
        // Vérifier que l'utilisateur qui suit existe
        const existingFollower = await this.checkUserExist(user.id)
        if (!existingFollower)
            throw new BadRequestException("Le compte du suiveur n'existe pas");
        
        // Vérifier que l'utilisateur à suivre existe
        const existingFollowing = await this.checkUserExist(createFollowDto.followingId)
        if (!existingFollowing)
            throw new BadRequestException("Le compte à suivre n'existe pas");

        // Empêche l'utilisateur de se suivre lui même
        if (existingFollower.id === existingFollowing.id)
            throw new BadRequestException(
                'Vous ne pouvez pas suivre votre propre compte',
            );
        
        // Vérifier si l'utilisateur est déjà suivit
        const alreadyFollow = await this.prisma.follow.findFirst({
            where: {
                followingId: createFollowDto.followingId,
                followerId: user.id,
            },
        });
        if (alreadyFollow)
            throw new BadRequestException('Vous suivez déjà cet utilisateur');

        // Création du suivis
        const newFollow = await this.prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: createFollowDto.followingId,
            },
        });
        return 'L\'utilisateur a été suivie avec succès';
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

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /* - - - - - - - - - - FONCTIONS PRIVÉES - - - - - - - - - - */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    private async checkUserExist (userId: number) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

}
