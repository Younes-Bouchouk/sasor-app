import { Module } from '@nestjs/common';
import { EventsInvitationsService } from './events-invitations.service';
import { EventsInvitationsController } from './events-invitations.controller';

@Module({
  controllers: [EventsInvitationsController],
  providers: [EventsInvitationsService],
})
export class EventsInvitationsModule {}
