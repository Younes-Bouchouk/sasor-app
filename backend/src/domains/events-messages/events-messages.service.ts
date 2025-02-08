import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventsMessageDto } from './dto/create-events-message.dto';
import { UpdateEventsMessageDto } from './dto/update-events-message.dto';
import { UserTokenData } from 'src/types/AuthUser';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsMessagesService {
    constructor(private readonly prisma: PrismaService){}

    async send(
        user: UserTokenData,
        eventId: number,
        createEventsMessageDto: CreateEventsMessageDto,
    ) {
        // On vérifie que l'event existe toujours
        const existingEvent = await this.prisma.event.findUnique({
            where: { id: eventId }
        })
        if (!existingEvent) throw new BadRequestException("L'event n'est plus disponible")

        // On vérifie que l'utilisateur participe à l'event
        const isParticipant = await this.prisma.eventParticipant.findFirst({
            where: {
                eventId,
                participantId: user.id
            }
        })
        if (!isParticipant) throw new BadRequestException("Vous devez participer à cet event pour pouvoir discuter")
            
        // Envoie du message
        const sendMessage = await this.prisma.eventMessage.create({
            data: { 
                senderId: user.id,
                eventId,
                message: createEventsMessageDto.message
            }
        })
        
        return "Message envoyé avec succès"
    }

    async findAll(
        user: UserTokenData,
        eventId: number,
    ) {
        // On vérifie que l'event existe toujours
        const existingEvent = await this.prisma.event.findUnique({
            where: { id: eventId }
        })
        if (!existingEvent) throw new BadRequestException("L'event n'est plus disponible")

        // On vérifie que l'utilisateur participe à l'event
        const isParticipant = await this.prisma.eventParticipant.findFirst({
            where: {
                eventId,
                participantId: user.id
            }
        })
        if (!isParticipant) throw new BadRequestException("Vous devez participer à cet event pour pouvoir discuter")
            

        return await this.prisma.eventMessage.findMany({
            where: { eventId }
        });
    }
}
