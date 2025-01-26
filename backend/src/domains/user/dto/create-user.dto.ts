import { Transform, Type } from 'class-transformer';
import {
    IsDate,
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Le pseudo est vide' })
    pseudo: string;

    @IsEmail({}, { message: "L'email n'est pas valide" })
    email: string;

    @Length(8, 20, {
        message: 'Le mot de passe doit contenir entre 8 et 20 caractères',
    })
    password: string;

    @IsDate({ message: 'La date de naissance doit être au format ISO-8601' })
    @Type(() => Date)
    birthday: Date;
}
