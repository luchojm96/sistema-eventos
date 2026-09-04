export type Rol = "administrador" | "cliente";

export interface Usuario {
  id: number;
  rol: Rol;
  email: string;
  nombre: string;
}
