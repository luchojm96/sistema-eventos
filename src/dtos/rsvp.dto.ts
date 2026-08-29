import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ResponderRsvpDto {
  @IsBoolean()
  confirma!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  acompanantes?: number;

  @IsOptional()
  @IsString()
  notas_especiales?: string;
}
