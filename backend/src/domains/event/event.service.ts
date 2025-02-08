import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
    constructor(private prisma: PrismaService) {}
    /*
                          ! Créer un nouvel événement organisé par un utilisateur. */
    //via al methode POSTA joute un nouvel enregistrement dans la table event.
    async createEvent(userId: number, data: CreateEventDto) {
        return await this.prisma.event.create({
            data: {
                organizerId: userId,
                ...data, // Les autres infos de l'événement (nom, date, etc.)
            },
        });
    }
    /*
                          ! Récupérer tous les événements. */
    async getAllEvents() {
        //retourne toutes les lignes de la table event.
        return await this.prisma.event.findMany();
    }
    /*
                        !  Récupérer les événements créés par un utilisateur spécifique. */
    async getUserEvents(userId: number) {
        // fitre les événements où organizerId correspond à l'userId donné.
        return await this.prisma.event.findMany({
            where: { organizerId: userId },
        });
    }
    /*
                        ! Récupérer les événements créés par mes follower  */
    async getFollowersEvents(userId: number) {
        // Récupérer les IDs des utilisateurs suivis
        const following = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true },
        });

        // Extraire les IDs des utilisateurs suivis
        const followingIds = following.map((f) => f.followingId);

        if (followingIds.length === 0) {
            return []; // Aucun follower, aucun événement
        }

        // Récupérer les événements des utilisateurs suivis
        return await this.prisma.event.findMany({
            where: {
                organizerId: { in: followingIds },
            },
            orderBy: { plannedAt: 'desc' }, // Trier par date
        });
    }

    /*
                         ! trouver un seul evenement avec son id*/
    async getEventById(eventId: number) {
        return await this.prisma.event.findUnique({
            where: { id: Number(eventId) },
        });
    }
    /* 
                          !Modifier un événement existant.*/
    async updateEvent(eventId: number, data: UpdateEventDto) {
        return await this.prisma.event.update({
            where: { id: Number(eventId) }, // préciser le type number
            data: {
                ...data,
            },
        });
    }
    /* 
                          !Supprimer un événement.*/
    async deleteEvent(eventId: number) {
        return await this.prisma.event.delete({
            where: { id: Number(eventId) },
        });
    }
    /*
                          !Obtenir la liste des participants d'un événement.*/
    async getEventParticipants(eventId: number) {
        return await this.prisma.eventParticipant.findMany({
            where: { eventId: Number(eventId) },
            include: { participant: true },
        });
    }
    /*
                          !Ajouter un utilisateur comme participant à un événement.*/
    async joinEvent(userId: number, eventId: number) {
        return await this.prisma.eventParticipant.create({
            data: { participantId: userId, eventId: Number(eventId) },
        });
    }
    /*
                      !Supprimer un utilisateur de la liste des participants.*/
    async leaveEvent(userId: number, eventId: number) {
        return await this.prisma.eventParticipant.deleteMany({
            where: { participantId: userId, eventId: Number(eventId) },
        });
    }
}
