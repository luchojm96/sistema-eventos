import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { EstadoEvento } from "../entities/enums";

export class CrearEventoDto {
  @IsString()
  @MinLength(2)
  nombre!: string;

  @IsInt()
  id_tipo_evento!: number;

  @IsInt()
  id_cliente!: number;

  @IsDateString()
  fecha_inicio!: string;

  @IsDateString()
  fecha_fin!: string;

  @IsString()
  @MinLength(2)
  ubicacion!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacidad_estimada?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  presupuesto_estimado?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  dias_anticipacion_recordatorio?: number;
}

// No incluye id_cliente: reasignar el evento a otro cliente no está contemplado
// en la especificación, así que no se acepta por esta vía.
export class ActualizarEventoDto {
  @IsOptional() @IsString() @MinLength(2) nombre?: string;
  @IsOptional() @IsInt() id_tipo_evento?: number;
  @IsOptional() @IsDateString() fecha_inicio?: string;
  @IsOptional() @IsDateString() fecha_fin?: string;
  @IsOptional() @IsString() @MinLength(2) ubicacion?: string;
  @IsOptional() @IsInt() @Min(0) capacidad_estimada?: number;
  @IsOptional() @IsNumber() @Min(0) presupuesto_estimado?: number;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsEnum(EstadoEvento) estado?: EstadoEvento;
  @IsOptional() @IsInt() @Min(0) dias_anticipacion_recordatorio?: number;
}
