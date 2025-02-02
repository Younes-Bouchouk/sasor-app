import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventParticipantService } from './event-participant.service';
import { CreateEventParticipantDto } from './dto/create-event-participant.dto';
import { UpdateEventParticipantDto } from './dto/update-event-participant.dto';

@Controller('event-participant')
export class EventParticipantController {
  constructor(private readonly eventParticipantService: EventParticipantService) {}

  @Post()
  create(@Body() createEventParticipantDto: CreateEventParticipantDto) {
    return this.eventParticipantService.create(createEventParticipantDto);
  }

  @Get()
  findAll() {
    return this.eventParticipantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventParticipantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventParticipantDto: UpdateEventParticipantDto) {
    return this.eventParticipantService.update(+id, updateEventParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventParticipantService.remove(+id);
  }
}
