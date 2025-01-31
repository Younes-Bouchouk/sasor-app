import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateEventParticipantDto {

    @IsNumber()
    @IsNotEmpty()
    participantId: number

    @IsNumber()
    @IsNotEmpty()
    eventId: number

}
