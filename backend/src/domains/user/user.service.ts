import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    // Définition de la variable "prisma" qui regroupe toutes les fonctions qui permettent de faire des requêtes à la base de donnée
    constructor(private readonly prisma: PrismaService) {}

    // Fonction qui permet de créer un utilisateur dans la table User
    async create(createUserDto: CreateUserDto) {

        // Premièrement, on va vérifier si l'email saisie est déjà existant dans la base de donnée

        // Je créer une variable dans laquelle j'effectue une première requête pour récupérer un utilisateur avec le mail saisie
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email }
        })

        // Si un utilisateur avec le même email existe, je retour l'erreur
        if (existingUser) { throw new BadRequestException("L'email est déjà utilisé")}
        
        // Sinon, j'effectue la requête qui me permet de créer une nouvelle ligne dans la table User
        return this.prisma.user.create({
            data: createUserDto,
        });
    }

    // Fonction qui permet de selectionner tous les utilisateurs de ma table User
    findAll() {
        return this.prisma.user.findMany();
    }

    // Fonction qui permet de selectionner un utilisateur de ma table User
    findOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    // Fonction qui permet de mettre à jour les infos d'un utilisateur dans la table User
    update(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        });
    }

    // Fonction qui permet de supprimer un utilisateur dans la table User
    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}
