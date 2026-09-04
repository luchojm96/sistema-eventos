import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CrearInvitadoDto {
  @IsString() @MinLength(1) nombre!: string;
  @IsString() @MinLength(1) apellido!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsInt() @Min(0) acompanantes_permitidos?: number;
  @IsOptional() @IsString() notas_especiales?: string;
}

export class ActualizarInvitadoDto {
  @IsOptional() @IsString() @MinLength(1) nombre?: string;
  @IsOptional() @IsString() @MinLength(1) apellido?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsInt() @Min(0) acompanantes_permitidos?: number;
  @IsOptional() @IsString() notas_especiales?: string;
}
