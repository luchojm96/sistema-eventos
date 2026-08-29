import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Evento } from "./Evento";
import { EstadoConfirmacionInvitado } from "./enums";

@Entity("invitados")
export class Invitado {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Evento, (evento) => evento.invitados, { nullable: false })
  @JoinColumn({ name: "id_evento" })
  evento!: Evento;

  @Column({ name: "id_evento" })
  id_evento!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "varchar", length: 100 })
  apellido!: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  telefono?: string;

  @Column({ type: "int", name: "acompanantes_permitidos", default: 0 })
  acompanantes_permitidos!: number;

  @Column({ type: "int", name: "acompanantes_confirmados", nullable: true })
  acompanantes_confirmados?: number;

  @Column({ type: "text", name: "notas_especiales", nullable: true })
  notas_especiales?: string;

  @Column({
    type: "enum",
    enum: EstadoConfirmacionInvitado,
    name: "estado_confirmacion",
    default: EstadoConfirmacionInvitado.PENDIENTE,
  })
  estado_confirmacion!: EstadoConfirmacionInvitado;

  @Column({ type: "varchar", length: 255, unique: true, name: "token_confirmacion" })
  token_confirmacion!: string;

  @Column({ type: "datetime", name: "fecha_respuesta", nullable: true })
  fecha_respuesta?: Date;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
