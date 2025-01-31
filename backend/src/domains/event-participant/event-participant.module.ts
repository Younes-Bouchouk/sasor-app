import { Module } from '@nestjs/common';
import { EventParticipantService } from './event-participant.service';
import { EventParticipantController } from './event-participant.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EventParticipantController],
    providers: [EventParticipantService],
})
export class EventParticipantModule {}
