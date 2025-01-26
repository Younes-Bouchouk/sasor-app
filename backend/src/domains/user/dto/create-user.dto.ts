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
    @IsNotEmpty({ message: "Le pseudo ne doit pas être vide" })
    @IsString()
    pseudo: string;

    @IsNotEmpty({ message: "L'email ne doit pas être vide" })
    @IsEmail({}, { message: "L'email n'est pas valide" })
    email: string;

    @IsNotEmpty({ message: "Le mot de pass ne doit pas être vide" })
    @Length(8, 20, { message: "Le mot de passe doit contenir entre 8 et 20 caractères"})
    password: string;

    @IsNotEmpty({ message: "La date de naissance ne doit pas être vide" })
    @IsDate({ message: "La date de naissance doit être au format ISO-8601" })
    @Type(() => Date)
    birthday: Date;
}
