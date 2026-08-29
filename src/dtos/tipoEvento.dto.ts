import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CrearTipoEventoDto {
  @IsString()
  @MinLength(2)
  nombre!: string;
}

export class ActualizarTipoEventoDto {
  @IsOptional() @IsString() @MinLength(2) nombre?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}
