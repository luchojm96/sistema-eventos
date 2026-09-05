import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  ValidateNested,
} from "class-validator";
import { MetodoPago } from "../entities/enums";

export class CuotaDto {
  @IsInt() @Min(1) numero_cuota!: number;
  @IsNumber() @IsPositive() monto!: number;
  @IsDateString() fecha_limite!: string;
}

export class CrearPlanPagoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CuotaDto)
  cuotas!: CuotaDto[];
}

export class AgregarCuotaDto {
  @IsNumber() @IsPositive() monto!: number;
  @IsDateString() fecha_limite!: string;
}

export class ActualizarCuotaDto {
  @IsOptional() @IsInt() @Min(1) numero_cuota?: number;
  @IsOptional() @IsNumber() @IsPositive() monto?: number;
  @IsOptional() @IsDateString() fecha_limite?: string;
}

export class RegistrarPagoDto {
  @IsOptional() @IsInt() id_cuota?: number;
  @IsNumber() @IsPositive() monto!: number;
  @IsDateString() fecha_pago!: string;
  @IsEnum(MetodoPago) metodo_pago!: MetodoPago;
}

export class ValidarPagoDto {
  @IsEnum(["Validado", "Rechazado"])
  decision!: "Validado" | "Rechazado";
}

export class RegistrarEgresoDto {
  @IsInt() id_evento_proveedor!: number;
  @IsNumber() @IsPositive() monto!: number;
  @IsDateString() fecha_pago!: string;
  @IsEnum(MetodoPago) metodo_pago!: MetodoPago;
}
