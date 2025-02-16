import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventsInvitationDto } from './dto/create-events-invitation.dto';
import { UpdateEventsInvitationDto } from './dto/update-events-invitation.dto';
import { UserTokenData } from 'src/types/AuthUser';
import { PrismaService } from 'src/prisma/prisma.service';
import { throws } from 'assert';

@Injectable()
export class EventsInvitationsService {
    constructor(private prisma: PrismaService) {}

    async create(
        user: UserTokenData,
        eventId: number,
        createEventsInvitationDto: CreateEventsInvitationDto,
    ) { 
        // Récupérer les variables du DTO
        const {inviteeId} = createEventsInvitationDto

        // Vérfier que l'utilisateur ne s'invite pas lui même mddrrr
        if (user.id === inviteeId) throw new BadRequestException("Vous ne pouvez pas vous inviter vous même")

        // Vérifier que l'event existe
        const existingEvent = await this.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!existingEvent) throw new BadRequestException("L'event est indisponible")
        
        // Vérfier que l'utilisateur à inviter existe
        const existingInvitee = await this.prisma.user.findUnique({
            where: { id: inviteeId}
        })
        if (!existingInvitee) throw new BadRequestException("L'utilisateur que vous essayé d'invité n'existe pas")

        // Vérifier si l'utilisateur à inviter participe à l'event
        const alreadyParticipant = await this.prisma.eventParticipant.findFirst({
            where: { eventId, participantId: inviteeId}
        }) 
        if (alreadyParticipant) throw new BadRequestException(`${existingInvitee.pseudo} fait déjà partie de l'event`)

        // Vérifier si l'utilisateur a déjà été invité par moi
        const alreadyInvitedByYou = await this.prisma.eventInvitation.findFirst({
            where: {eventId, inviterId: user.id, inviteeId}
        })
        if (alreadyInvitedByYou) throw new BadRequestException(`Vous avez déjà invité ${existingInvitee.pseudo} à rejoindre cet event`)

        // Vérfier si l'utilisateur fais partie lui même partit de l'event
        const isParticipant = await this.prisma.eventParticipant.findFirst({
            where: {
                eventId, participantId: user.id
            }
        })
        if (!isParticipant) throw new BadRequestException("Vous ne pouvez pas inviter si vous ne faites pas partie de l'event")

        //Vérfier si l'utilisateur est autoriser à inviter
        if (!isParticipant.canInvite) throw new BadRequestException("Vous n'êtes pas autorisé à inviter qui que ce soit")

        const newInvite = await this.prisma.eventInvitation.create({
            data: {
                eventId,
                inviterId: user.id,
                inviteeId,
            },
        });

        return 'Invitation envoyé avec succès'
    }

    async findOneInvite(user: UserTokenData, invitationId: number) {
        // Vérfier que l'invitation existe
        const existingInvite = await this.prisma.eventInvitation.findUnique({
            where: { id: invitationId }
        })
        if (!existingInvite) throw new BadRequestException("L'invitation est introuvable")

        // Vérifier que l'utilisateur est soit l'inviteur ou l'invité
        if (existingInvite.inviterId !== user.id && existingInvite.inviteeId !== user.id) throw new BadRequestException("Vous n'êtes pas concerné par cette invitation")

        return existingInvite
    }

    findInvitationsReceived(user: UserTokenData) {
        return this.prisma.eventInvitation.findMany({
            where: { inviteeId: user.id}
        });
    }

    findInvitationsSent(user: UserTokenData) {
        return this.prisma.eventInvitation.findMany({
            where: { inviterId: user.id}
        });
    }

    async acceptInvitation(user: UserTokenData, invitationId: number) {
        const invitation = await this.prisma.eventInvitation.findFirst({
            where: { id: invitationId }
        })
        if (!invitation) throw new BadRequestException("L'invitation est introuvable")
        if (invitation.inviteeId !== user.id) throw new BadRequestException("Vous n'êtes pas l'utilisateur invité à cet event")
        if (invitation.status === 'ACCEPTED') throw new BadRequestException("L'invitation a déjà été accepté")
        if (invitation.status === 'DECLINED') throw new BadRequestException("L'invitation n'est plus disponible")

        const event = await this.prisma.event.findUnique({
            where: { id: invitation.eventId }
        })
        if (!event) throw new BadRequestException("Event introuvable")

        const isParticipant = await this.prisma.eventParticipant.findFirst({
            where: { eventId: event.id, participantId: user.id}
        })    
        if (isParticipant) throw new BadRequestException("Vous participez déjà à l'event")

        const particpants = await this.prisma.eventParticipant.findMany({
            where: { id: event.id },
        })

        if (particpants.length >= event.maxParticipants) throw new BadRequestException("L'event est complet")

        await this.prisma.eventInvitation.update({
            where: { id: invitationId },
            data: { status: "ACCEPTED" }
        })

        await this.prisma.eventParticipant.create({
            data: {
                eventId: event.id,
                participantId: user.id
            }
        })

        return "Vous avez acceptez l'invtation"
        
    }

    remove(id: number) {
        return `This action removes a #${id} eventsInvitation`;
    }
}
