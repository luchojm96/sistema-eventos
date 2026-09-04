import { apiFetch } from "./client";
import type { Usuario } from "../types/auth.types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegistroPayload {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export function login(payload: LoginPayload) {
  return apiFetch<{ user: Usuario }>("/auth/login", { method: "POST", body: payload });
}

export function registro(payload: RegistroPayload) {
  return apiFetch<{ user: Usuario }>("/auth/registro", { method: "POST", body: payload });
}

export function me() {
  return apiFetch<{ user: Usuario }>("/auth/me");
}

export function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}
