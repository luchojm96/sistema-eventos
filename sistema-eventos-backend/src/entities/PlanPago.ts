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
import { PagoCliente } from "./PagoCliente";

@Entity("plan_pagos")
export class PlanPago {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Evento, (evento) => evento.planPagos, { nullable: false })
  @JoinColumn({ name: "id_evento" })
  evento!: Evento;

  @Column({ name: "id_evento" })
  id_evento!: number;

  @Column({ type: "int", name: "numero_cuota" })
  numero_cuota!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  monto!: string;

  @Column({ type: "date", name: "fecha_limite" })
  fecha_limite!: string;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @OneToMany(() => PagoCliente, (pagoCliente) => pagoCliente.cuota)
  pagos!: PagoCliente[];
}
