import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { TipoEvento } from "./TipoEvento";
import { Cliente } from "./Cliente";
import { Invitado } from "./Invitado";
import { EventoProveedor } from "./EventoProveedor";
import { PlanPago } from "./PlanPago";
import { PagoCliente } from "./PagoCliente";
import { EstadoEvento } from "./enums";

@Entity("eventos")
export class Evento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 200 })
  nombre!: string;

  @ManyToOne(() => TipoEvento, (tipoEvento) => tipoEvento.eventos, { nullable: false })
  @JoinColumn({ name: "id_tipo_evento" })
  tipoEvento!: TipoEvento;

  @Column({ name: "id_tipo_evento" })
  id_tipo_evento!: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.eventos, { nullable: false })
  @JoinColumn({ name: "id_cliente" })
  cliente!: Cliente;

  @Column({ name: "id_cliente" })
  id_cliente!: number;

  @Column({ type: "date", name: "fecha_inicio" })
  fecha_inicio!: string;

  @Column({ type: "date", name: "fecha_fin" })
  fecha_fin!: string;

  @Column({ type: "varchar", length: 255 })
  ubicacion!: string;

  @Column({ type: "int", name: "capacidad_estimada", nullable: true })
  capacidad_estimada?: number;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "presupuesto_estimado", nullable: true })
  presupuesto_estimado?: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @Column({ type: "enum", enum: EstadoEvento, default: EstadoEvento.PLANIFICADO })
  estado!: EstadoEvento;

  @Column({ type: "int", name: "dias_anticipacion_recordatorio", default: 7 })
  dias_anticipacion_recordatorio!: number;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at!: Date;

  @OneToMany(() => Invitado, (invitado) => invitado.evento)
  invitados!: Invitado[];

  @OneToMany(() => EventoProveedor, (eventoProveedor) => eventoProveedor.evento)
  proveedores!: EventoProveedor[];

  @OneToMany(() => PlanPago, (planPago) => planPago.evento)
  planPagos!: PlanPago[];

  @OneToMany(() => PagoCliente, (pagoCliente) => pagoCliente.evento)
  pagos!: PagoCliente[];
}
