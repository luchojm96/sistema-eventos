import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Proveedor } from "./Proveedor";

@Entity("categorias_proveedor")
export class CategoriaProveedor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nombre!: string;

  @Column({ type: "boolean", default: true })
  activo!: boolean;

  @OneToMany(() => Proveedor, (proveedor) => proveedor.categoria)
  proveedores!: Proveedor[];
}
