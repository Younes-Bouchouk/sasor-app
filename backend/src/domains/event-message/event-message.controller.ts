import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventMessageService } from './event-message.service';
import { CreateEventMessageDto } from './dto/create-event-message.dto';
import { UpdateEventMessageDto } from './dto/update-event-message.dto';

@Controller('event-message')
export class EventMessageController {
  constructor(private readonly eventMessageService: EventMessageService) {}

  @Post()
  create(@Body() createEventMessageDto: CreateEventMessageDto) {
    return this.eventMessageService.create(createEventMessageDto);
  }

  @Get()
  findAll() {
    return this.eventMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventMessageDto: UpdateEventMessageDto) {
    return this.eventMessageService.update(+id, updateEventMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventMessageService.remove(+id);
  }
}
