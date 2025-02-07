import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
// import { AuthService } from '../auth/auth.service';


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // @UseGuards(AuthService)
  @Post()
  create(@Req() req, @Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(req.user.id, createEventDto);
  }

  @Get()
  getAll() {
    return this.eventService.getAllEvents();
  }

  // @UseGuards(AuthService)
  @Get('me')
  getMyEvents(@Req() req) {
    return this.eventService.getUserEvents(req.user.id);
  }

  // @UseGuards(AuthService)
  @Get('followers')
  getFollowersEvents(@Req() req) {
    return this.eventService.getFollowersEvents(req.user.followingIds);
  }

  @Get(':eventId')
  getEvent(@Param('eventId') eventId: number) {
    return this.eventService.getEventById(eventId);
  }

  // @UseGuards(AuthService)
  @Patch(':eventId')
  update(@Param('eventId') eventId: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent(eventId, updateEventDto);
  }

  // @UseGuards(AuthService)
  @Delete(':eventId')
  delete(@Param('eventId') eventId: number) {
    return this.eventService.deleteEvent(eventId);
  }

  @Get(':eventId/participants')
  getParticipants(@Param('eventId') eventId: number) {
    return this.eventService.getEventParticipants(eventId);
  }

  // @UseGuards(AuthService)
  @Post(':eventId/join')
  join(@Req() req, @Param('eventId') eventId: number) {
    return this.eventService.joinEvent(req.user.id, eventId);
  }

  // @UseGuards(AuthService)
  @Delete(':eventId/exit')
  exit(@Req() req, @Param('eventId') eventId: number) {
    return this.eventService.leaveEvent(req.user.id, eventId);
  }
}
