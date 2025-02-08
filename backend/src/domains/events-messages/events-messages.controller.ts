import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { EventsMessagesService } from './events-messages.service';
import { CreateEventsMessageDto } from './dto/create-events-message.dto';
import { UpdateEventsMessageDto } from './dto/update-events-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/AuthUser';

@Controller('events/:eventId/messages')
export class EventsMessagesController {
    constructor(
        private readonly eventsMessagesService: EventsMessagesService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    send(
        @Req() req: AuthenticatedRequest,
        @Param('eventId') eventId: number,
        @Body() createEventsMessageDto: CreateEventsMessageDto,
    ) {
        return this.eventsMessagesService.send(req.user, +eventId, createEventsMessageDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(
        @Req() req: AuthenticatedRequest,
        @Param('eventId') eventId: number,
    ) {
        return this.eventsMessagesService.findAll(req.user, +eventId);
    }

}
