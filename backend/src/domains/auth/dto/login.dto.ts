import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {

    @IsNotEmpty({ message: "L'email ne doit pas être vide" })
    @IsEmail({}, { message: "L'email n'est pas valide" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Le mot de passe ne doit pas être vide" })
    password: string;
}
