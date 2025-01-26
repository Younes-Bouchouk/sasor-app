import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRelationDto {
    
    @IsNotEmpty({message: "L'id du follower ne doit pas être vide"})    
    @IsInt({message: "L'id du follower doit être un nombre"})
    followerId: number;

    @IsNotEmpty({message: "L'id du follower ne doit pas être vide"})    
    @IsInt({message: "L'id de l'utilisateur doit être un nombre"})
    followingId: number;
}
