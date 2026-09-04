import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class CrearProveedorDto {
  @IsString() @MinLength(2) nombre_empresa!: string;
  @IsInt() id_categoria!: number;
  @IsOptional() @IsString() contacto_nombre?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsEmail() email?: string;
}

export class ActualizarProveedorDto {
  @IsOptional() @IsString() @MinLength(2) nombre_empresa?: string;
  @IsOptional() @IsInt() id_categoria?: number;
  @IsOptional() @IsString() contacto_nombre?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsBoolean() activo?: boolean;
}
