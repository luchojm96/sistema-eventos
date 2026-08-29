import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class CrearCategoriaProveedorDto {
  @IsString()
  @MinLength(2)
  nombre!: string;
}

export class ActualizarCategoriaProveedorDto {
  @IsOptional() @IsString() @MinLength(2) nombre?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}
