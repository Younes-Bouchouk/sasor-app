import { Module } from '@nestjs/common';
import { EventMessageService } from './event-message.service';
import { EventMessageController } from './event-message.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [EventMessageController],
    providers: [EventMessageService],
})
export class EventMessageModule {}
