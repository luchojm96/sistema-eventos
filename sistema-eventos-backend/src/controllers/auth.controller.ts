import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegistroDto } from "../dtos/auth.dto";

const authService = new AuthService();
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginDto;

  const { token, payload } = await authService.login(email, password);
  setAuthCookie(res, token);
  res.json({ user: payload });
}

export async function registro(req: Request, res: Response) {
  const { nombre, email, password, telefono } = req.body as RegistroDto;

  const { token, payload } = await authService.registrarCliente({ nombre, email, password, telefono });
  setAuthCookie(res, token);
  res.status(201).json({ user: payload });
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ message: "Sesión cerrada" });
}
