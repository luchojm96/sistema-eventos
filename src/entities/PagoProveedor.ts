import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { EventoProveedor } from "./EventoProveedor";
import { MetodoPago } from "./enums";

@Entity("pagos_proveedor")
export class PagoProveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => EventoProveedor, (eventoProveedor) => eventoProveedor.pagos, { nullable: false })
  @JoinColumn({ name: "id_evento_proveedor" })
  eventoProveedor!: EventoProveedor;

  @Column({ name: "id_evento_proveedor" })
  id_evento_proveedor!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monto!: string;

  @Column({ type: "date", name: "fecha_pago" })
  fecha_pago!: string;

  @Column({ type: "enum", enum: MetodoPago, name: "metodo_pago" })
  metodo_pago!: MetodoPago;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
