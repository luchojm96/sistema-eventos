import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Evento } from "./Evento";
import { PlanPago } from "./PlanPago";
import { MetodoPago, RegistradoPor, EstadoPagoCliente } from "./enums";

@Entity("pagos_cliente")
export class PagoCliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Evento, (evento) => evento.pagos, { nullable: false })
  @JoinColumn({ name: "id_evento" })
  evento!: Evento;

  @Column({ name: "id_evento" })
  id_evento!: number;

  @ManyToOne(() => PlanPago, (planPago) => planPago.pagos, { nullable: true })
  @JoinColumn({ name: "id_cuota" })
  cuota?: PlanPago;

  @Column({ name: "id_cuota", nullable: true })
  id_cuota?: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monto!: string;

  @Column({ type: "date", name: "fecha_pago" })
  fecha_pago!: string;

  @Column({ type: "enum", enum: MetodoPago, name: "metodo_pago" })
  metodo_pago!: MetodoPago;

  @Column({ type: "varchar", length: 500, name: "comprobante_url", nullable: true })
  comprobante_url?: string;

  @Column({ type: "enum", enum: RegistradoPor, name: "registrado_por" })
  registrado_por!: RegistradoPor;

  @Column({
    type: "enum",
    enum: EstadoPagoCliente,
    default: EstadoPagoCliente.REPORTADO,
  })
  estado!: EstadoPagoCliente;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
