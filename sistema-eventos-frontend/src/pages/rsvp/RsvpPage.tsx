import { useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import * as rsvpApi from "../../api/rsvp.api";
import { useApiData } from "../../hooks/useApiData";
import { ApiError } from "../../api/client";
import { Button } from "../../components/ui/Button";
import type { ResponderRsvpResult } from "../../api/rsvp.api";

type Paso = "eleccion" | "confirmar_asistencia" | "confirmar_rechazo";

function Tarjeta({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">{children}</div>
    </div>
  );
}

export function RsvpPage() {
  const { token } = useParams();
  const { data, loading, error } = useApiData(() => rsvpApi.obtener(token!), [token]);

  const [paso, setPaso] = useState<Paso>("eleccion");
  const [acompanantes, setAcompanantes] = useState(0);
  const [notasEspeciales, setNotasEspeciales] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResponderRsvpResult | null>(null);

  async function enviarRespuesta(confirma: boolean) {
    setErrorEnvio(null);
    setEnviando(true);
    try {
      const res = await rsvpApi.responder(token!, {
        confirma,
        acompanantes: confirma ? acompanantes : undefined,
        notas_especiales: notasEspeciales || undefined,
      });
      setResultado(res);
    } catch (err) {
      setErrorEnvio(err instanceof ApiError ? err.message : "No se pudo registrar tu respuesta");
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return (
      <Tarjeta>
        <p className="text-sm text-slate-500">Cargando...</p>
      </Tarjeta>
    );
  }

  if (error || !data) {
    return (
      <Tarjeta>
        <h1 className="text-lg font-semibold text-slate-900">Enlace inválido</h1>
        <p className="mt-2 text-sm text-slate-500">{error ?? "Este enlace de confirmación no es válido."}</p>
      </Tarjeta>
    );
  }

  const { evento, invitado } = data;

  if (data.finalizado) {
    return (
      <Tarjeta>
        <h1 className="text-lg font-semibold text-slate-900">{evento.nombre}</h1>
        <p className="mt-4 text-sm text-slate-600">El evento ya finalizó.</p>
      </Tarjeta>
    );
  }

  if (resultado) {
    return (
      <Tarjeta>
        <h1 className="text-lg font-semibold text-slate-900">¡Gracias, {invitado.nombre}!</h1>
        <p className="mt-4 text-sm text-slate-600">
          {resultado.estado_confirmacion === "Confirmado"
            ? `Confirmaste tu asistencia${resultado.acompanantes_confirmados ? ` con ${resultado.acompanantes_confirmados} acompañante(s)` : ""}.`
            : "Registramos que no podrás asistir."}
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Tu respuesta ya quedó registrada. Cualquier cambio debe gestionarse directamente con la organización.
        </p>
      </Tarjeta>
    );
  }

  if (invitado.estado_confirmacion !== "Pendiente") {
    return (
      <Tarjeta>
        <h1 className="text-lg font-semibold text-slate-900">{evento.nombre}</h1>
        <p className="mt-4 text-sm text-slate-600">
          Hola {invitado.nombre}, ya registraste tu respuesta:{" "}
          <strong>{invitado.estado_confirmacion === "Confirmado" ? "asistirás" : "no podrás asistir"}</strong>.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Cualquier cambio debe gestionarse directamente con la organización.
        </p>
      </Tarjeta>
    );
  }

  return (
    <Tarjeta>
      <h1 className="text-lg font-semibold text-slate-900">{evento.nombre}</h1>
      <p className="mt-1 text-sm text-slate-500">{evento.ubicacion}</p>
      <p className="mt-1 text-sm text-slate-500">
        {evento.fecha_inicio}
        {evento.fecha_fin !== evento.fecha_inicio ? ` – ${evento.fecha_fin}` : ""}
      </p>

      <p className="mt-6 text-sm text-slate-700">
        Hola {invitado.nombre} {invitado.apellido}, por favor confirmá tu asistencia.
      </p>

      {paso === "eleccion" && (
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={() => setPaso("confirmar_asistencia")}>Sí, asistiré</Button>
          <Button variant="secondary" onClick={() => setPaso("confirmar_rechazo")}>
            No podré asistir
          </Button>
        </div>
      )}

      {paso === "confirmar_asistencia" && (
        <div className="mt-6 flex flex-col gap-4 text-left">
          {invitado.acompanantes_permitidos > 0 && (
            <div className="flex flex-col gap-1">
              <label htmlFor="acompanantes" className="text-sm font-medium text-slate-700">
                Acompañantes (máximo {invitado.acompanantes_permitidos})
              </label>
              <input
                id="acompanantes"
                type="number"
                min={0}
                max={invitado.acompanantes_permitidos}
                value={acompanantes}
                onChange={(event) => setAcompanantes(Number(event.target.value))}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="notas" className="text-sm font-medium text-slate-700">
              Notas especiales (opcional)
            </label>
            <textarea
              id="notas"
              rows={2}
              value={notasEspeciales}
              onChange={(event) => setNotasEspeciales(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {errorEnvio && <p className="text-sm text-red-600">{errorEnvio}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPaso("eleccion")} disabled={enviando}>
              Volver
            </Button>
            <Button onClick={() => enviarRespuesta(true)} disabled={enviando}>
              {enviando ? "Enviando..." : "Confirmar asistencia"}
            </Button>
          </div>
        </div>
      )}

      {paso === "confirmar_rechazo" && (
        <div className="mt-6 flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1">
            <label htmlFor="notas-rechazo" className="text-sm font-medium text-slate-700">
              Notas especiales (opcional)
            </label>
            <textarea
              id="notas-rechazo"
              rows={2}
              value={notasEspeciales}
              onChange={(event) => setNotasEspeciales(event.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {errorEnvio && <p className="text-sm text-red-600">{errorEnvio}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPaso("eleccion")} disabled={enviando}>
              Volver
            </Button>
            <Button variant="danger" onClick={() => enviarRespuesta(false)} disabled={enviando}>
              {enviando ? "Enviando..." : "Confirmar que no asistiré"}
            </Button>
          </div>
        </div>
      )}
    </Tarjeta>
  );
}
