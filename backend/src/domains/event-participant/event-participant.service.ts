import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventParticipantDto } from './dto/create-event-participant.dto';
import { UpdateEventParticipantDto } from './dto/update-event-participant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Event } from '@prisma/client';

@Injectable()
export class EventParticipantService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createEventParticipantDto: CreateEventParticipantDto) {
        const { participantId, eventId } = createEventParticipantDto

        const event: Event | null = await this.prisma.event.findUnique({where: { id: eventId }})
        if (!event) { throw new BadRequestException("L'event a été supprimé")}

        const participants = await this.prisma.eventParticipant.findMany({where: { eventId }})
        const alreadyJoined = participants.filter(row => row.participantId === participantId)
        
        if (alreadyJoined.length) { throw new BadRequestException("Vous êtes déjà inscrit dans la liste des participants")}
        if (participants.length >= event.maxParticipants) { throw new BadRequestException("L'event est complet") }
        
        return this.prisma.eventParticipant.create({
            data: createEventParticipantDto
        });
    }

    findAll() {
        return this.prisma.eventParticipant.findMany();
    }

    findOne(id: number) {
        return this.prisma.eventParticipant.findUnique({where: {id}});
    }

    update(id: number, updateEventParticipantDto: UpdateEventParticipantDto) {
        return this.prisma.eventParticipant.update({
            where: {id},
            data: updateEventParticipantDto
        });
    }

    remove(id: number) {
        return this.prisma.eventParticipant.delete({where: {id}});
    }
}
