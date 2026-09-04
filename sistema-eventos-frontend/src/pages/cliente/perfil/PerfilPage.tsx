import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as clientesApi from "../../../api/clientes.api";
import { useApiData } from "../../../hooks/useApiData";
import { ApiError } from "../../../api/client";
import {
  cambiarPasswordSchema,
  clientePerfilSchema,
  type CambiarPasswordFormValues,
  type ClientePerfilFormValues,
} from "../../../schemas/cliente.schema";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";

export function PerfilPage() {
  const { data: cliente, loading, error } = useApiData(() => clientesApi.obtenerPerfil());
  const [mensajePerfil, setMensajePerfil] = useState<string | null>(null);
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  const [mensajePassword, setMensajePassword] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const perfilForm = useForm<ClientePerfilFormValues>({ resolver: zodResolver(clientePerfilSchema) });

  useEffect(() => {
    if (cliente) {
      perfilForm.reset({ nombre: cliente.nombre, telefono: cliente.telefono });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente]);

  const passwordForm = useForm<CambiarPasswordFormValues>({
    resolver: zodResolver(cambiarPasswordSchema),
  });

  async function onSubmitPerfil(values: ClientePerfilFormValues) {
    setMensajePerfil(null);
    setErrorPerfil(null);
    try {
      const actualizado = await clientesApi.actualizarPerfil(values);
      setMensajePerfil(`Perfil actualizado: ${actualizado.nombre}.`);
    } catch (err) {
      setErrorPerfil(err instanceof ApiError ? err.message : "No se pudo actualizar el perfil");
    }
  }

  async function onSubmitPassword(values: CambiarPasswordFormValues) {
    setMensajePassword(null);
    setErrorPassword(null);
    try {
      await clientesApi.cambiarPassword({
        password_actual: values.password_actual,
        password_nueva: values.password_nueva,
      });
      setMensajePassword("Contraseña actualizada.");
      passwordForm.reset();
    } catch (err) {
      setErrorPassword(err instanceof ApiError ? err.message : "No se pudo cambiar la contraseña");
    }
  }

  return (
    <div className="mx-auto max-w-lg p-8">
      <h1 className="text-xl font-semibold text-slate-900">Mi perfil</h1>

      {loading && <p className="mt-6 text-sm text-slate-500">Cargando...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {cliente && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">Mis datos</h2>
          <p className="mt-1 text-xs text-slate-500">Email: {cliente.email} (no editable).</p>
          <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)} className="mt-4 flex flex-col gap-4">
            <TextField
              label="Nombre"
              error={perfilForm.formState.errors.nombre?.message}
              {...perfilForm.register("nombre")}
            />
            <TextField
              label="Teléfono"
              error={perfilForm.formState.errors.telefono?.message}
              {...perfilForm.register("telefono")}
            />
            {mensajePerfil && <p className="text-sm text-green-700">{mensajePerfil}</p>}
            {errorPerfil && <p className="text-sm text-red-600">{errorPerfil}</p>}
            <Button type="submit" disabled={perfilForm.formState.isSubmitting}>
              Guardar datos
            </Button>
          </form>
        </section>
      )}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">Cambiar contraseña</h2>
        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="mt-4 flex flex-col gap-4">
          <TextField
            label="Contraseña actual"
            type="password"
            error={passwordForm.formState.errors.password_actual?.message}
            {...passwordForm.register("password_actual")}
          />
          <TextField
            label="Contraseña nueva"
            type="password"
            error={passwordForm.formState.errors.password_nueva?.message}
            {...passwordForm.register("password_nueva")}
          />
          <TextField
            label="Confirmar contraseña nueva"
            type="password"
            error={passwordForm.formState.errors.confirmar_password?.message}
            {...passwordForm.register("confirmar_password")}
          />
          {mensajePassword && <p className="text-sm text-green-700">{mensajePassword}</p>}
          {errorPassword && <p className="text-sm text-red-600">{errorPassword}</p>}
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            Cambiar contraseña
          </Button>
        </form>
      </section>
    </div>
  );
}
