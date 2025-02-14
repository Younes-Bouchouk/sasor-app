import { Injectable } from '@nestjs/common';
import { CreateEventsInvitationDto } from './dto/create-events-invitation.dto';
import { UpdateEventsInvitationDto } from './dto/update-events-invitation.dto';

@Injectable()
export class EventsInvitationsService {
  create(createEventsInvitationDto: CreateEventsInvitationDto) {
    return 'This action adds a new eventsInvitation';
  }

  findAll() {
    return `This action returns all eventsInvitations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventsInvitation`;
  }

  update(id: number, updateEventsInvitationDto: UpdateEventsInvitationDto) {
    return `This action updates a #${id} eventsInvitation`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventsInvitation`;
  }
}
