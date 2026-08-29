import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("administradores")
export class Administrador {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  nombre!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, name: "password_hash", select: false })
  password_hash!: string;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
