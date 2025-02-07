import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteFollowDto{
    @IsNumber()
    @IsNotEmpty({ message: "L'id du follow ne doit pas être vide" })
    followingId:number
}
