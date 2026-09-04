import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";
import { loginSchema, type LoginFormValues } from "../../schemas/auth.schema";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";
import type { Usuario } from "../../types/auth.types";

function rutaInicioPorRol(user: Usuario) {
  return user.rol === "administrador" ? "/admin/dashboard" : "/cliente/mis-eventos";
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setErrorServidor(null);
    try {
      const user = await login(values.email, values.password);
      const destino = (location.state as { from?: string } | null)?.from ?? rutaInicioPorRol(user);
      navigate(destino, { replace: true });
    } catch (error) {
      setErrorServidor(error instanceof ApiError ? error.message : "No se pudo iniciar sesión");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Iniciar sesión</h1>

        <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-slate-900 underline">
            Registrate
          </Link>
        </p>
      </form>
    </div>
  );
}
