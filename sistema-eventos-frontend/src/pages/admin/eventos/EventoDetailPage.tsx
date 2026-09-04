import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as eventosApi from "../../../api/eventos.api";
import * as invitadosApi from "../../../api/invitados.api";
import * as eventoProveedoresApi from "../../../api/eventoProveedores.api";
import * as proveedoresApi from "../../../api/proveedores.api";
import * as planPagosApi from "../../../api/planPagos.api";
import * as pagosClienteApi from "../../../api/pagosCliente.api";
import * as pagosProveedorApi from "../../../api/pagosProveedor.api";
import { useApiData } from "../../../hooks/useApiData";
import { ApiError } from "../../../api/client";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { InvitadosTable } from "../../../components/invitados/InvitadosTable";
import { ContratacionesTable } from "../../../components/proveedores/ContratacionesTable";
import { PlanPagosTable } from "../../../components/pagos/PlanPagosTable";
import { PagosClienteTable } from "../../../components/pagos/PagosClienteTable";
import { PagosProveedorTable } from "../../../components/pagos/PagosProveedorTable";
import { PagoClienteFormModal } from "../../../components/pagos/PagoClienteFormModal";
import { ReporteEventoSection } from "../../../components/reportes/ReporteEventoSection";
import { ContratacionFormModal } from "./ContratacionFormModal";
import { PlanPagoFormModal } from "./PlanPagoFormModal";
import { CuotaEditModal } from "./CuotaEditModal";
import { EgresoFormModal } from "./EgresoFormModal";
import { COLOR_ESTADO_EVENTO } from "../../../utils/estadoEvento";
import type { EventoProveedor, PagoCliente, PlanPago } from "../../../types/entities";

export function EventoDetailPage() {
  const { id } = useParams();
  const eventoId = Number(id);
  const navigate = useNavigate();

  const { data: evento, loading, error, refetch } = useApiData(() => eventosApi.obtener(eventoId), [eventoId]);
  const { data: resumen, refetch: refetchResumen } = useApiData(() => eventosApi.resumen(eventoId), [eventoId]);
  const { data: invitados, loading: cargandoInvitados } = useApiData(
    () => invitadosApi.listarPorEvento(eventoId),
    [eventoId],
  );
  const {
    data: contrataciones,
    loading: cargandoContrataciones,
    refetch: refetchContrataciones,
  } = useApiData(() => eventoProveedoresApi.listarPorEvento(eventoId), [eventoId]);
  const { data: proveedores } = useApiData(() => proveedoresApi.listar());
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
  const {
    data: egresos,
    loading: cargandoEgresos,
    refetch: refetchEgresos,
  } = useApiData(() => pagosProveedorApi.listarPorEvento(eventoId), [eventoId]);

  const [errorCancelar, setErrorCancelar] = useState<string | null>(null);
  const [modalContratacion, setModalContratacion] = useState<"nueva" | EventoProveedor | null>(null);
  const [contratacionACancelar, setContratacionACancelar] = useState<EventoProveedor | null>(null);
  const [cancelandoContratacion, setCancelandoContratacion] = useState(false);
  const [errorContratacion, setErrorContratacion] = useState<string | null>(null);
  const [modalPlanPago, setModalPlanPago] = useState(false);
  const [cuotaAEditar, setCuotaAEditar] = useState<PlanPago | null>(null);
  const [modalNuevoPago, setModalNuevoPago] = useState(false);
  const [modalNuevoEgreso, setModalNuevoEgreso] = useState(false);
  const [errorValidarPago, setErrorValidarPago] = useState<string | null>(null);

  async function handleCancelar() {
    setErrorCancelar(null);
    try {
      await eventosApi.cancelar(eventoId);
      refetch();
    } catch (err) {
      setErrorCancelar(err instanceof ApiError ? err.message : "No se pudo cancelar el evento");
    }
  }

  function refetchProveedoresYResumen() {
    refetchContrataciones();
    refetchResumen();
  }

  function refetchPagosYResumen() {
    refetchCuotas();
    refetchPagosCliente();
    refetchResumen();
  }

  async function handleValidarPago(pago: PagoCliente, decision: "Validado" | "Rechazado") {
    setErrorValidarPago(null);
    try {
      await pagosClienteApi.validar(pago.id, decision);
      refetchPagosYResumen();
    } catch (err) {
      setErrorValidarPago(err instanceof ApiError ? err.message : "No se pudo actualizar el pago");
    }
  }

  async function handleConfirmarCancelarContratacion() {
    if (!contratacionACancelar) return;
    setErrorContratacion(null);
    setCancelandoContratacion(true);
    try {
      await eventoProveedoresApi.cancelar(eventoId, contratacionACancelar.id);
      setContratacionACancelar(null);
      refetchProveedoresYResumen();
    } catch (err) {
      setErrorContratacion(err instanceof ApiError ? err.message : "No se pudo cancelar la contratación");
    } finally {
      setCancelandoContratacion(false);
    }
  }

  if (loading) return <p className="p-8 text-sm text-slate-500">Cargando...</p>;
  if (error) return <p className="p-8 text-sm text-red-600">{error}</p>;
  if (!evento) return null;

  const puedeGestionar = evento.estado !== "Cancelado";
  const proveedoresActivos = (proveedores ?? []).filter((proveedor) => proveedor.activo);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{evento.nombre}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {evento.tipoEvento?.nombre} · {evento.cliente?.nombre} · {evento.ubicacion}
          </p>
        </div>
        <Badge color={COLOR_ESTADO_EVENTO[evento.estado]}>{evento.estado}</Badge>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Fechas</dt>
          <dd className="text-slate-900">
            {evento.fecha_inicio}
            {evento.fecha_fin !== evento.fecha_inicio ? ` – ${evento.fecha_fin}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Capacidad estimada</dt>
          <dd className="text-slate-900">{evento.capacidad_estimada ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Presupuesto estimado</dt>
          <dd className="text-slate-900">{evento.presupuesto_estimado ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Días anticipación RSVP</dt>
          <dd className="text-slate-900">{evento.dias_anticipacion_recordatorio}</dd>
        </div>
        {evento.descripcion && (
          <div className="col-span-2">
            <dt className="text-slate-500">Descripción</dt>
            <dd className="text-slate-900">{evento.descripcion}</dd>
          </div>
        )}
      </dl>

      {resumen && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase text-slate-500">Invitados</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{resumen.invitados.total}</p>
            <p className="text-xs text-slate-500">
              {resumen.invitados.confirmados} confirmados · {resumen.invitados.pendientes} pendientes ·{" "}
              {resumen.invitados.rechazados} rechazados
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase text-slate-500">Proveedores contratados</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{resumen.proveedoresContratados}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase text-slate-500">Total pagado (validado)</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">${resumen.pagos.totalValidado}</p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Invitados</h2>
        <p className="mt-1 text-sm text-slate-500">
          Solo lectura — la gestión de invitados la hace el Cliente desde su propia vista del evento.
        </p>
        <div className="mt-3">
          {cargandoInvitados && <p className="text-sm text-slate-500">Cargando...</p>}
          {invitados && <InvitadosTable invitados={invitados} />}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Proveedores contratados</h2>
          <Button onClick={() => setModalContratacion("nueva")}>Contratar proveedor</Button>
        </div>

        {errorContratacion && <p className="mt-3 text-sm text-red-600">{errorContratacion}</p>}

        <div className="mt-3">
          {cargandoContrataciones && <p className="text-sm text-slate-500">Cargando...</p>}
          {contrataciones && (
            <ContratacionesTable
              contrataciones={contrataciones}
              renderAcciones={(contratacion) =>
                contratacion.estado_contrato === "Cotizado" || contratacion.estado_contrato === "Contratado" ? (
                  <div className="flex justify-end gap-3 text-sm">
                    <button
                      className="font-medium text-slate-600 hover:underline"
                      onClick={() => setModalContratacion(contratacion)}
                    >
                      Editar
                    </button>
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => setContratacionACancelar(contratacion)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : null
              }
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Plan de pagos</h2>
          {(!cuotas || cuotas.length === 0) && <Button onClick={() => setModalPlanPago(true)}>Definir plan</Button>}
        </div>
        <div className="mt-3">
          {cargandoCuotas && <p className="text-sm text-slate-500">Cargando...</p>}
          {cuotas && (
            <PlanPagosTable
              cuotas={cuotas}
              renderAcciones={(cuota) => (
                <button className="font-medium text-slate-600 hover:underline" onClick={() => setCuotaAEditar(cuota)}>
                  Editar
                </button>
              )}
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Ingresos (pagos del Cliente)</h2>
          <Button onClick={() => setModalNuevoPago(true)}>Registrar pago</Button>
        </div>
        {errorValidarPago && <p className="mt-3 text-sm text-red-600">{errorValidarPago}</p>}
        <div className="mt-3">
          {cargandoPagosCliente && <p className="text-sm text-slate-500">Cargando...</p>}
          {pagosCliente && (
            <PagosClienteTable
              pagos={pagosCliente}
              renderAcciones={(pago) =>
                pago.estado === "Reportado" ? (
                  <div className="flex justify-end gap-3 text-sm">
                    <button
                      className="font-medium text-slate-600 hover:underline"
                      onClick={() => handleValidarPago(pago, "Validado")}
                    >
                      Validar
                    </button>
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => handleValidarPago(pago, "Rechazado")}
                    >
                      Rechazar
                    </button>
                  </div>
                ) : null
              }
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Egresos (pagos a proveedores)</h2>
          <Button onClick={() => setModalNuevoEgreso(true)}>Registrar egreso</Button>
        </div>
        <div className="mt-3">
          {cargandoEgresos && <p className="text-sm text-slate-500">Cargando...</p>}
          {egresos && <PagosProveedorTable pagos={egresos} />}
        </div>
      </div>

      <ReporteEventoSection idEvento={eventoId} />

      {errorCancelar && <p className="mt-4 text-sm text-red-600">{errorCancelar}</p>}

      <div className="mt-6 flex gap-3">
        <Link to="/admin/eventos">
          <Button variant="secondary">Volver</Button>
        </Link>
        {puedeGestionar && (
          <>
            <Button variant="secondary" onClick={() => navigate(`/admin/eventos/${evento.id}/editar`)}>
              Editar
            </Button>
            <Button variant="danger" onClick={handleCancelar}>
              Cancelar evento
            </Button>
          </>
        )}
      </div>

      {modalContratacion && (
        <ContratacionFormModal
          idEvento={eventoId}
          proveedoresActivos={proveedoresActivos}
          contratacion={modalContratacion === "nueva" ? null : modalContratacion}
          onClose={() => setModalContratacion(null)}
          onGuardado={() => {
            setModalContratacion(null);
            refetchProveedoresYResumen();
          }}
        />
      )}

      {contratacionACancelar && (
        <Modal title="Cancelar contratación" onClose={() => setContratacionACancelar(null)}>
          <p className="text-sm text-slate-600">
            ¿Cancelar la contratación de{" "}
            <strong>{contratacionACancelar.proveedor?.nombre_empresa}</strong>? No se elimina el registro, queda con
            estado "Cancelado".
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setContratacionACancelar(null)}>
              Volver
            </Button>
            <Button variant="danger" onClick={handleConfirmarCancelarContratacion} disabled={cancelandoContratacion}>
              {cancelandoContratacion ? "Cancelando..." : "Cancelar contratación"}
            </Button>
          </div>
        </Modal>
      )}

      {modalPlanPago && (
        <PlanPagoFormModal
          idEvento={eventoId}
          onClose={() => setModalPlanPago(false)}
          onGuardado={() => {
            setModalPlanPago(false);
            refetchCuotas();
          }}
        />
      )}

      {cuotaAEditar && (
        <CuotaEditModal
          cuota={cuotaAEditar}
          onClose={() => setCuotaAEditar(null)}
          onGuardado={() => {
            setCuotaAEditar(null);
            refetchCuotas();
          }}
        />
      )}

      {modalNuevoPago && (
        <PagoClienteFormModal
          idEvento={eventoId}
          cuotas={cuotas ?? []}
          onClose={() => setModalNuevoPago(false)}
          onGuardado={() => {
            setModalNuevoPago(false);
            refetchPagosYResumen();
          }}
        />
      )}

      {modalNuevoEgreso && (
        <EgresoFormModal
          idEvento={eventoId}
          contrataciones={(contrataciones ?? []).filter((c) => c.estado_contrato !== "Cancelado")}
          onClose={() => setModalNuevoEgreso(false)}
          onGuardado={() => {
            setModalNuevoEgreso(false);
            refetchEgresos();
            refetchProveedoresYResumen();
          }}
        />
      )}
    </div>
  );
}
