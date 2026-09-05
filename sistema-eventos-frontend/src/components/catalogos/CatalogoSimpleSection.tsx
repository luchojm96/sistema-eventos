import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApiData } from "../../hooks/useApiData";
import { ApiError } from "../../api/client";
import { TextField } from "../ui/TextField";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const nombreSchema = z.object({ nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres") });
type NombreFormValues = z.infer<typeof nombreSchema>;

interface ItemCatalogo {
  id: number;
  nombre: string;
  activo: boolean;
}

interface Props<T extends ItemCatalogo> {
  titulo: string;
  descripcion: string;
  labelNuevo: string;
  listar: () => Promise<T[]>;
  crear: (nombre: string) => Promise<T>;
  actualizar: (id: number, datos: { nombre?: string; activo?: boolean }) => Promise<T>;
}

export function CatalogoSimpleSection<T extends ItemCatalogo>({
  titulo,
  descripcion,
  labelNuevo,
  listar,
  crear,
  actualizar,
}: Props<T>) {
  const { data: items, loading, error, refetch } = useApiData(listar);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const inputId = useId();

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [valorEdicion, setValorEdicion] = useState("");
  const [errorEdicion, setErrorEdicion] = useState<string | null>(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NombreFormValues>({ resolver: zodResolver(nombreSchema) });

  async function onSubmit(values: NombreFormValues) {
    setErrorServidor(null);
    try {
      await crear(values.nombre);
      reset();
      refetch();
    } catch (err) {
      setErrorServidor(err instanceof ApiError ? err.message : "No se pudo crear el registro");
    }
  }

  async function toggleActivo(item: T) {
    await actualizar(item.id, { activo: !item.activo });
    refetch();
  }

  function iniciarEdicion(item: T) {
    setEditandoId(item.id);
    setValorEdicion(item.nombre);
    setErrorEdicion(null);
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setErrorEdicion(null);
  }

  async function guardarEdicion(id: number) {
    const nombre = valorEdicion.trim();
    if (nombre.length < 2) {
      setErrorEdicion("El nombre debe tener al menos 2 caracteres");
      return;
    }
    setErrorEdicion(null);
    setGuardandoEdicion(true);
    try {
      await actualizar(id, { nombre });
      setEditandoId(null);
      refetch();
    } catch (err) {
      setErrorEdicion(err instanceof ApiError ? err.message : "No se pudo guardar el nombre");
    } finally {
      setGuardandoEdicion(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
      <p className="mt-1 text-sm text-slate-500">{descripcion}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex items-end gap-3">
        <div className="flex-1">
          <TextField id={inputId} label={labelNuevo} error={errors.nombre?.message} {...register("nombre")} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Agregar
        </Button>
      </form>
      {errorServidor && <p className="mt-2 text-sm text-red-600">{errorServidor}</p>}

      <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {loading && <p className="p-4 text-sm text-slate-500">Cargando...</p>}
        {error && <p className="p-4 text-sm text-red-600">{error}</p>}
        {items?.length === 0 && <p className="p-4 text-sm text-slate-500">Todavía no hay registros.</p>}
        {items?.map((item) =>
          editandoId === item.id ? (
            <div key={item.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-end sm:gap-3">
              <div className="flex-1">
                <TextField
                  id={`editar-nombre-${item.id}`}
                  label="Nombre"
                  value={valorEdicion}
                  onChange={(event) => setValorEdicion(event.target.value)}
                  error={errorEdicion ?? undefined}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={cancelarEdicion} disabled={guardandoEdicion}>
                  Cancelar
                </Button>
                <Button onClick={() => guardarEdicion(item.id)} disabled={guardandoEdicion}>
                  {guardandoEdicion ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <div key={item.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-900">{item.nombre}</span>
                <Badge color={item.activo ? "green" : "slate"}>{item.activo ? "Activo" : "Inactivo"}</Badge>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  className="font-medium text-slate-600 hover:underline"
                  onClick={() => iniciarEdicion(item)}
                >
                  Editar
                </button>
                <Button variant="secondary" onClick={() => toggleActivo(item)}>
                  {item.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
