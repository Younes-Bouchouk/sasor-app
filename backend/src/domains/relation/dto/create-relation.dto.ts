import { IsNumber } from 'class-validator';

export class CreateRelationDto {
    @IsNumber()
    followerId: number;

    @IsNumber()
    followingId: number;
}
