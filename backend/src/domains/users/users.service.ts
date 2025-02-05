import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    // Permet de récupérer tous les utilisateurs
    findAll() {
        return this.prisma.user.findMany();
    }

    // Permet de récupérer un seul utilisateur
    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    // Permet de récupérer l'utilisateur connecté
    findMe() {
        return "Prochainement, après la mise en place du token";
    }

    // Permet de mettre à jour les infos de l'utilisateur connecté
    async update(updateUserDto: UpdateUserDto) {
        const existingPseudo = await this.prisma.user.findUnique({where: { pseudo: updateUserDto.pseudo }})
        if (existingPseudo) { throw new BadRequestException("Le pseudo est déjà utilisé") }

        return this.prisma.user.update({
            where: { id: 1 },
            data: updateUserDto
        });
    }

    // Permet de supprimer l'utilisateur connecté
    remove() {
        return this.prisma.user.delete({ where: { id: 7 } });
    }
}
