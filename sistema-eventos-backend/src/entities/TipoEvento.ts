import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Evento } from "./Evento";

@Entity("tipos_evento")
export class TipoEvento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @OneToMany(() => Evento, (evento) => evento.tipoEvento)
  eventos!: Evento[];
}
