import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { EstadoContrato } from "../entities/enums";

export class ContratarProveedorDto {
  @IsInt() id_proveedor!: number;
  @IsOptional() @IsString() descripcion_servicio?: string;
  @IsNumber() @IsPositive() costo_acordado!: number;
  @IsDateString() fecha_servicio!: string;
  @IsOptional() @IsString() hora_inicio?: string;
  @IsOptional() @IsString() hora_fin?: string;
  @IsOptional() @IsInt() @Min(1) cantidad?: number;
}

// estado_contrato acepta cualquier valor del enum salvo "Pagado" (se valida en
// el service, ya que class-validator no puede excluir un solo valor del enum
// de forma declarativa sin duplicar la lista).
export class ActualizarContratacionDto {
  @IsOptional() @IsString() descripcion_servicio?: string;
  @IsOptional() @IsNumber() @IsPositive() costo_acordado?: number;
  @IsOptional() @IsDateString() fecha_servicio?: string;
  @IsOptional() @IsString() hora_inicio?: string;
  @IsOptional() @IsString() hora_fin?: string;
  @IsOptional() @IsInt() @Min(1) cantidad?: number;
  @IsOptional() @IsEnum(EstadoContrato) estado_contrato?: EstadoContrato;
}
