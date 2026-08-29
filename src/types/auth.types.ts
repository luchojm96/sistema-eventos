export type Rol = "administrador" | "cliente";

export interface JwtPayload {
  id: number;
  rol: Rol;
  email: string;
  nombre: string;
}
