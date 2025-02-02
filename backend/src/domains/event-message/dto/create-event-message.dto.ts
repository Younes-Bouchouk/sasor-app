import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateEventMessageDto {

    @IsNotEmpty({message: "L'id du sender ne doit pas être vide"})
    @IsNumber()
    senderId: number

    @IsNotEmpty({message: "L'id de l'event ne doit pas être vide"})
    @IsNumber()
    eventId: number

    @IsString()
    @IsNotEmpty({message: "Le message ne doit pas être vide"})
    message: string
}
