import { PartialType } from '@nestjs/mapped-types';
import { CreateEventMessageDto } from './create-event-message.dto';

export class UpdateEventMessageDto extends PartialType(CreateEventMessageDto) {}
