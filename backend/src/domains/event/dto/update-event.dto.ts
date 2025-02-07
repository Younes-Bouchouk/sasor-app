import { IsInt, IsOptional, IsString, IsEnum, IsDate } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsInt()
  maxParticipants?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'FRIENDS-ONLY'])
  visibility?: string;

  @IsOptional()
  @IsDate()
  plannedAt?: Date;
}
