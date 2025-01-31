import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty({ message: "L'id de l'organisateur ne doit pas être vide" })
    @IsNumber()
    organizerId: number;

    @IsString()
    @IsNotEmpty({ message: "Le nom de l'évènement ne doit être vide" })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional({ message: 'Le sport ne peut pas être vide' })
    sport: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Le nombre de participant ne doit pas vide' })
    maxParticipants: number;

    @IsString()
    @IsNotEmpty({ message: 'La localisation ne doit pas être vide' })
    location: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'Le type private ne doit pas être vide' })
    private: boolean;

    @IsNotEmpty({ message: 'La date de naissance ne doit pas être vide' })
    @IsDate({ message: 'La date de naissance doit être au format ISO-8601' })
    @Type(() => Date)
    plannedAt: Date;
}
