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
        // Vérifiez si le champ `pseudo` est présent dans la requête
        if (updateUserDto.pseudo) {
          if (updateUserDto.pseudo === user.pseudo) {
            throw new BadRequestException('Vous utilisez déjà ce pseudo');
          }
      
          const existingPseudo = await this.prisma.user.findUnique({
            where: { pseudo: updateUserDto.pseudo },
          });
      
          if (existingPseudo) {
            throw new BadRequestException('Le pseudo est déjà utilisé');
          }
        }
      
        // Effectuez la mise à jour
        return this.prisma.user.update({
          where: { id: user.id },
          data: updateUserDto,
        });
      }

    async remove(user: UserTokenData) {
        //  Supprimer les participations aux événements organisés par l'utilisateur
        await this.prisma.eventParticipant.deleteMany({
            where: {
                event: { organizerId: user.id }
            },
        });
    
        //  Supprimer les participations de l'utilisateur
        await this.prisma.eventParticipant.deleteMany({
            where: { participantId: user.id },
        });
    
        //  Supprimer les messages envoyés par l'utilisateur
        await this.prisma.eventMessage.deleteMany({
            where: { senderId: user.id },
        });
    
        // Supprimer les messages liés aux événements organisés par l'utilisateur
        await this.prisma.eventMessage.deleteMany({
            where: {
                event: { organizerId: user.id }
            },
        });
    
        // Supprimer les invitations envoyées et reçues
        await this.prisma.eventInvitation.deleteMany({
            where: {
                OR: [{ inviterId: user.id }, { inviteeId: user.id }],
            },
        });
    
        // Supprimer les invitations liées aux événements organisés par l'utilisateur
        await this.prisma.eventInvitation.deleteMany({
            where: {
                event: { organizerId: user.id }
            },
        });
    
        //  Supprimer les événements organisés par l'utilisateur
        await this.prisma.event.deleteMany({
            where: { organizerId: user.id },
        });
    
        //  Supprimer l'utilisateur après avoir tout nettoyé
        return this.prisma.user.delete({
            where: { id: user.id },
        });
    }
    
    
      
}
