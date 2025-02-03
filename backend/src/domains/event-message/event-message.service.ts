import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventMessageDto } from './dto/create-event-message.dto';
import { UpdateEventMessageDto } from './dto/update-event-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventMessageService {
    constructor(private readonly prisma: PrismaService){}

    async create(createEventMessageDto: CreateEventMessageDto) {
        const {senderId, eventId, message} = createEventMessageDto

        const existingEvent = await this.prisma.event.findUnique({where: {id: eventId}})
        if (!existingEvent) {throw new BadRequestException("L'event est inexistant")}

        const isParticipant = await this.prisma.eventParticipant.findFirst({
            where: {eventId: eventId, participantId: senderId}
        })
        if (!isParticipant) {throw new BadRequestException("Vous ne pouvez pas envoyer de message si ne participer pas à l'event")}

        return this.prisma.eventMessage.create({data: createEventMessageDto});
    }

    findAll() {
        return this.prisma.eventMessage.findMany();
    }

    findOne(id: number) {
        return this.prisma.eventMessage.findUnique({where: {id}});
    }

    update(id: number, updateEventMessageDto: UpdateEventMessageDto) {
        return this.prisma.eventMessage.update({
            where: {id},
            data: updateEventMessageDto
        });
    }

    remove(id: number) {
        return this.prisma.eventMessage.delete({where: {id}});
    }
}
