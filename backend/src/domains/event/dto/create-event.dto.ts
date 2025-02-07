import { IsInt, IsOptional, IsString, IsEnum, IsDate } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  sport: string;

  @IsInt()
  maxParticipants: number;

  @IsString()
  location: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'FRIENDS-ONLY'])
  visibility?: string = 'PUBLIC';

  @IsDate()
  plannedAt: Date;
}
