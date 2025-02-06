import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserTokenData } from 'src/types/AuthUser';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    // Permet de récupérer tous les utilisateurs
    findAll() {
        return this.prisma.user.findMany();
    }

    // Permet de récupérer un seul utilisateur
    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    // Permet de récupérer l'utilisateur connecté
    findMe(user: UserTokenData) {
        return this.prisma.user.findUnique({ where: { id: user.id } });
    }

    // Permet de mettre à jour les infos de l'utilisateur connecté
    async update(user: UserTokenData, updateUserDto: UpdateUserDto) {
        if (updateUserDto.pseudo === user.pseudo)
            throw new BadRequestException('Vous utilisé déjà ce pseudo')

        const existingPseudo = await this.prisma.user.findUnique({
            where: { pseudo: updateUserDto.pseudo },
        });
        if (existingPseudo)
            throw new BadRequestException('Le pseudo est déjà utilisé');

        return this.prisma.user.update({
            where: { id: user.id },
            data: updateUserDto,
        });
    }

    // Permet de supprimer l'utilisateur connecté
    remove(user: UserTokenData) {
        return this.prisma.user.delete({ where: { id: user.id } });
    }
}
