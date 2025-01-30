import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { CreateUserDto } from "src/domains/user/dto/create-user.dto";

export class RegisterDto extends CreateUserDto {

    @IsString()
    @IsNotEmpty({ message: "Le mot de passe à confirmer ne doit pas être vide" })
    @Length(8, 20, { message: "Le mot de passe à confirmer doit contenir entre 8 et 20 caractères"})
    confirmPassword: string
}
