import { Request, Response, NextFunction } from "express";
import { verificarToken } from "../utils/jwt";
import { Rol } from "../types/auth.types";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  try {
    req.user = verificarToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function requireRole(...roles: Rol[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403).json({ message: "No autorizado" });
      return;
    }
    next();
  };
}
