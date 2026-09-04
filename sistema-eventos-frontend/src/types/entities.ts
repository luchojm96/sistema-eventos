import type {
  EstadoConfirmacionInvitado,
  EstadoContrato,
  EstadoEvento,
  EstadoPagoCliente,
  MetodoPago,
  RegistradoPor,
} from "./enums";

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  activo: boolean;
  created_at: string;
}

export interface TipoEvento {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Evento {
  id: number;
  nombre: string;
  id_tipo_evento: number;
  id_cliente: number;
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  capacidad_estimada?: number;
  presupuesto_estimado?: string;
  descripcion?: string;
  estado: EstadoEvento;
  dias_anticipacion_recordatorio: number;
  created_at: string;
  updated_at: string;
  tipoEvento?: TipoEvento;
  cliente?: Cliente;
}

export interface ResumenEvento {
  invitados: { total: number; confirmados: number; pendientes: number; rechazados: number };
  proveedoresContratados: number;
  pagos: { totalValidado: number; cantidadRegistros: number };
}

export interface Invitado {
  id: number;
  id_evento: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  acompanantes_permitidos: number;
  acompanantes_confirmados?: number;
  notas_especiales?: string;
  estado_confirmacion: EstadoConfirmacionInvitado;
  token_confirmacion: string;
  fecha_respuesta?: string;
  created_at: string;
}

export interface CategoriaProveedor {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Proveedor {
  id: number;
  nombre_empresa: string;
  id_categoria: number;
  contacto_nombre?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  created_at: string;
  categoria?: CategoriaProveedor;
}

export interface EventoProveedor {
  id: number;
  id_evento: number;
  id_proveedor: number;
  descripcion_servicio?: string;
  costo_acordado: string;
  fecha_servicio: string;
  hora_inicio?: string;
  hora_fin?: string;
  cantidad?: number;
  estado_contrato: EstadoContrato;
  created_at: string;
  proveedor?: Proveedor;
}

export interface PlanPago {
  id: number;
  id_evento: number;
  numero_cuota: number;
  monto: string;
  fecha_limite: string;
  created_at: string;
  pagada?: boolean;
}

export interface PagoCliente {
  id: number;
  id_evento: number;
  id_cuota?: number;
  monto: string;
  fecha_pago: string;
  metodo_pago: MetodoPago;
  comprobante_url?: string;
  registrado_por: RegistradoPor;
  estado: EstadoPagoCliente;
  created_at: string;
}

export interface PagoProveedor {
  id: number;
  id_evento_proveedor: number;
  monto: string;
  fecha_pago: string;
  metodo_pago: MetodoPago;
  created_at: string;
  eventoProveedor?: EventoProveedor;
}
