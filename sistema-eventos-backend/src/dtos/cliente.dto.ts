import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class ActualizarPerfilClienteDto {
  @IsOptional() @IsString() @MinLength(2) nombre?: string;
  @IsOptional() @IsString() telefono?: string;
}

export class CambiarPasswordDto {
  @IsString()
  @MinLength(6)
  password_actual!: string;

  @IsString()
  @MinLength(6)
  password_nueva!: string;
}

export class ActualizarClienteDto {
  @IsOptional() @IsString() @MinLength(2) nombre?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}
