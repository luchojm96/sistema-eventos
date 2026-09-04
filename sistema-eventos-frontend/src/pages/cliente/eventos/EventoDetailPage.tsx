import { useRef, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import * as invitadosApi from "../../../api/invitados.api";
import * as eventoProveedoresApi from "../../../api/eventoProveedores.api";
import * as planPagosApi from "../../../api/planPagos.api";
import * as pagosClienteApi from "../../../api/pagosCliente.api";
import { useApiData } from "../../../hooks/useApiData";
import { ApiError } from "../../../api/client";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { InvitadosTable } from "../../../components/invitados/InvitadosTable";
import { ContratacionesTable } from "../../../components/proveedores/ContratacionesTable";
import { PlanPagosTable } from "../../../components/pagos/PlanPagosTable";
import { PagosClienteTable } from "../../../components/pagos/PagosClienteTable";
import { PagoClienteFormModal } from "../../../components/pagos/PagoClienteFormModal";
import { ReporteEventoSection } from "../../../components/reportes/ReporteEventoSection";
import { InvitadoFormModal } from "./InvitadoFormModal";
import { COLOR_ESTADO_EVENTO } from "../../../utils/estadoEvento";
import type { Invitado } from "../../../types/entities";

export function EventoDetailPage() {
  const { id } = useParams();
  const eventoId = Number(id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: evento, loading, error } = useApiData(() => eventosApi.obtener(eventoId), [eventoId]);
  const {
    data: invitados,
    loading: cargandoInvitados,
    error: errorInvitados,
    refetch: refetchInvitados,
  } = useApiData(() => invitadosApi.listarPorEvento(eventoId), [eventoId]);
  const { data: contrataciones, loading: cargandoContrataciones } = useApiData(
    () => eventoProveedoresApi.listarPorEvento(eventoId),
    [eventoId],
  );
  const {
    data: cuotas,
    loading: cargandoCuotas,
    refetch: refetchCuotas,
  } = useApiData(() => planPagosApi.obtener(eventoId), [eventoId]);
  const {
    data: pagosCliente,
    loading: cargandoPagosCliente,
    refetch: refetchPagosCliente,
  } = useApiData(() => pagosClienteApi.listarPorEvento(eventoId), [eventoId]);

  const [modal, setModal] = useState<"nuevo" | Invitado | null>(null);
  const [invitadoAEliminar, setInvitadoAEliminar] = useState<Invitado | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [modalNuevoPago, setModalNuevoPago] = useState(false);

  function limpiarMensajes() {
    setMensajeAccion(null);
    setErrorAccion(null);
  }

  async function handleConfirmarEliminar() {
    if (!invitadoAEliminar) return;
    limpiarMensajes();
    setEliminando(true);
    try {
      await invitadosApi.eliminar(invitadoAEliminar.id);
      setInvitadoAEliminar(null);
      refetchInvitados();
    } catch (err) {
      setErrorAccion(err instanceof ApiError ? err.message : "No se pudo eliminar el invitado");
    } finally {
      setEliminando(false);
    }
  }

  async function handleReenviar(invitado: Invitado) {
    limpiarMensajes();
    try {
      await invitadosApi.reenviarInvitacion(invitado.id);
      setMensajeAccion(`Invitación reenviada a ${invitado.nombre} ${invitado.apellido}.`);
    } catch (err) {
      setErrorAccion(err instanceof ApiError ? err.message : "No se pudo reenviar la invitación");
    }
  }

  async function handleImportar(event: ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0];
    event.target.value = "";
    if (!archivo) return;

    limpiarMensajes();
    setImportando(true);
    try {
      const resultado = await invitadosApi.importar(eventoId, archivo);
      setMensajeAccion(`Se importaron ${resultado.creados} invitados.`);
      refetchInvitados();
    } catch (err) {
      setErrorAccion(err instanceof ApiError ? err.message : "No se pudo importar el archivo");
    } finally {
      setImportando(false);
    }
  }

  if (loading) return <p className="p-8 text-sm text-slate-500">Cargando...</p>;
  if (error) return <p className="p-8 text-sm text-red-600">{error}</p>;
  if (!evento) return null;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{evento.nombre}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {evento.tipoEvento?.nombre} · {evento.ubicacion}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {evento.fecha_inicio}
            {evento.fecha_fin !== evento.fecha_inicio ? ` – ${evento.fecha_fin}` : ""}
          </p>
        </div>
        <Badge color={COLOR_ESTADO_EVENTO[evento.estado]}>{evento.estado}</Badge>
      </div>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Invitados</h2>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleImportar}
            />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={importando}>
              {importando ? "Importando..." : "Importar CSV/XLSX"}
            </Button>
            <Button onClick={() => setModal("nuevo")}>Agregar invitado</Button>
          </div>
        </div>

        {mensajeAccion && <p className="mt-3 text-sm text-green-700">{mensajeAccion}</p>}
        {errorAccion && <p className="mt-3 text-sm text-red-600">{errorAccion}</p>}

        <div className="mt-4">
          {cargandoInvitados && <p className="text-sm text-slate-500">Cargando invitados...</p>}
          {errorInvitados && <p className="text-sm text-red-600">{errorInvitados}</p>}
          {invitados && (
            <InvitadosTable
              invitados={invitados}
              renderAcciones={(invitado) => (
                <div className="flex justify-end gap-3 text-sm">
                  {invitado.email && invitado.estado_confirmacion === "Pendiente" && (
                    <button
                      className="font-medium text-slate-600 hover:underline"
                      onClick={() => handleReenviar(invitado)}
                    >
                      Reenviar
                    </button>
                  )}
                  <button className="font-medium text-slate-600 hover:underline" onClick={() => setModal(invitado)}>
                    Editar
                  </button>
                  <button
                    className="font-medium text-red-600 hover:underline"
                    onClick={() => setInvitadoAEliminar(invitado)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Proveedores</h2>
        <p className="mt-1 text-sm text-slate-500">
          Solo lectura — la contratación de proveedores es responsabilidad del Administrador.
        </p>
        <div className="mt-3">
          {cargandoContrataciones && <p className="text-sm text-slate-500">Cargando...</p>}
          {contrataciones && <ContratacionesTable contrataciones={contrataciones} />}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Plan de pagos</h2>
        <div className="mt-3">
          {cargandoCuotas && <p className="text-sm text-slate-500">Cargando...</p>}
          {cuotas && <PlanPagosTable cuotas={cuotas} />}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Mis pagos</h2>
          <Button onClick={() => setModalNuevoPago(true)}>Registrar pago</Button>
        </div>
        <div className="mt-3">
          {cargandoPagosCliente && <p className="text-sm text-slate-500">Cargando...</p>}
          {pagosCliente && <PagosClienteTable pagos={pagosCliente} />}
        </div>
      </section>

      <ReporteEventoSection idEvento={eventoId} />

      <div className="mt-6">
        <Link to="/cliente/mis-eventos">
          <Button variant="secondary">Volver</Button>
        </Link>
      </div>

      {modal && (
        <InvitadoFormModal
          idEvento={eventoId}
          invitado={modal === "nuevo" ? null : modal}
          onClose={() => setModal(null)}
          onGuardado={() => {
            setModal(null);
            refetchInvitados();
          }}
        />
      )}

      {invitadoAEliminar && (
        <Modal title="Eliminar invitado" onClose={() => setInvitadoAEliminar(null)}>
          <p className="text-sm text-slate-600">
            ¿Eliminar a <strong>{invitadoAEliminar.nombre} {invitadoAEliminar.apellido}</strong>? Esta acción no se
            puede deshacer.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setInvitadoAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmarEliminar} disabled={eliminando}>
              {eliminando ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </Modal>
      )}

      {modalNuevoPago && (
        <PagoClienteFormModal
          idEvento={eventoId}
          cuotas={cuotas ?? []}
          onClose={() => setModalNuevoPago(false)}
          onGuardado={() => {
            setModalNuevoPago(false);
            refetchCuotas();
            refetchPagosCliente();
          }}
        />
      )}
    </div>
  );
}
