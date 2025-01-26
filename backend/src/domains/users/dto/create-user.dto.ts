import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(6, 10, { message: 'Name doit contenir 6 à 10 caractères' })
    @IsNotEmpty({ message: 'Name ne peut pas être vide' })
    name: string;
}
