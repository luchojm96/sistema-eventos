import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { CategoriaProveedor } from "./CategoriaProveedor";
import { EventoProveedor } from "./EventoProveedor";

@Entity("proveedores")
export class Proveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 200, name: "nombre_empresa" })
  nombre_empresa!: string;

  @ManyToOne(() => CategoriaProveedor, (categoria) => categoria.proveedores, { nullable: false })
  @JoinColumn({ name: "id_categoria" })
  categoria!: CategoriaProveedor;

  @Column({ name: "id_categoria" })
  id_categoria!: number;

  @Column({ type: "varchar", length: 150, name: "contacto_nombre", nullable: true })
  contacto_nombre?: string;

  @Column({ type: "varchar", length: 30, nullable: true })
  telefono?: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email?: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @OneToMany(() => EventoProveedor, (eventoProveedor) => eventoProveedor.proveedor)
  contrataciones!: EventoProveedor[];
}
