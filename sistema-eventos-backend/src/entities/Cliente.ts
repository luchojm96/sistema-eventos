import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Evento } from "./Evento";

@Entity("clientes")
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  nombre!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, name: "password_hash", select: false })
  password_hash!: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  telefono?: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @OneToMany(() => Evento, (evento) => evento.cliente)
  eventos!: Evento[];
}
