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
import { EventsInvitationsService } from './events-invitations.service';
import { CreateEventsInvitationDto } from './dto/create-events-invitation.dto';
import { UpdateEventsInvitationDto } from './dto/update-events-invitation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/AuthUser';

@Controller('events')
export class EventsInvitationsController {
    constructor(
        private readonly eventsInvitationsService: EventsInvitationsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/:eventId/invitations')
    create(
        @Req() req: AuthenticatedRequest,
        @Param('eventId') eventId: number,
        @Body() createEventsInvitationDto: CreateEventsInvitationDto,
    ) {
        return this.eventsInvitationsService.create(
            req.user,
            +eventId,
            createEventsInvitationDto,
        );
    }

    @Get()
    findAll() {
        return this.eventsInvitationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsInvitationsService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEventsInvitationDto: UpdateEventsInvitationDto,
    ) {
        return this.eventsInvitationsService.update(
            +id,
            updateEventsInvitationDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsInvitationsService.remove(+id);
    }
}
