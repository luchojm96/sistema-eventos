import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../api/client";
import { registroSchema, type RegistroFormValues } from "../../schemas/auth.schema";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";

export function RegistroPage() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues>({ resolver: zodResolver(registroSchema) });

  async function onSubmit(values: RegistroFormValues) {
    setErrorServidor(null);
    try {
      await registro(values);
      navigate("/cliente/mis-eventos", { replace: true });
    } catch (error) {
      setErrorServidor(error instanceof ApiError ? error.message : "No se pudo completar el registro");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Crear cuenta de Cliente</h1>

        <TextField label="Nombre" error={errors.nombre?.message} {...register("nombre")} />
        <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <TextField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField label="Teléfono (opcional)" error={errors.telefono?.message} {...register("telefono")} />

        {errorServidor && <p className="text-sm text-red-600">{errorServidor}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-slate-900 underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
