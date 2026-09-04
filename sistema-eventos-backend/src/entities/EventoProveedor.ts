import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Evento } from "./Evento";
import { Proveedor } from "./Proveedor";
import { PagoProveedor } from "./PagoProveedor";
import { EstadoContrato } from "./enums";

@Entity("evento_proveedor")
export class EventoProveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Evento, (evento) => evento.proveedores, { nullable: false })
  @JoinColumn({ name: "id_evento" })
  evento!: Evento;

  @Column({ name: "id_evento" })
  id_evento!: number;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.contrataciones, { nullable: false })
  @JoinColumn({ name: "id_proveedor" })
  proveedor!: Proveedor;

  @Column({ name: "id_proveedor" })
  id_proveedor!: number;

  @Column({ type: "text", name: "descripcion_servicio", nullable: true })
  descripcion_servicio?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, name: "costo_acordado" })
  costo_acordado!: string;

  @Column({ type: "date", name: "fecha_servicio" })
  fecha_servicio!: string;

  @Column({ type: "time", name: "hora_inicio", nullable: true })
  hora_inicio?: string;

  @Column({ type: "time", name: "hora_fin", nullable: true })
  hora_fin?: string;

  @Column({ type: "int", nullable: true })
  cantidad?: number;

  @Column({
    type: "enum",
    enum: EstadoContrato,
    name: "estado_contrato",
    default: EstadoContrato.COTIZADO,
  })
  estado_contrato!: EstadoContrato;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @OneToMany(() => PagoProveedor, (pagoProveedor) => pagoProveedor.eventoProveedor)
  pagos!: PagoProveedor[];
}
