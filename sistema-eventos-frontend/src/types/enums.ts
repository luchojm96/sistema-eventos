export const ESTADOS_EVENTO = ["Planificado", "Confirmado", "En curso", "Finalizado", "Cancelado"] as const;
export type EstadoEvento = (typeof ESTADOS_EVENTO)[number];

export const ESTADOS_CONFIRMACION_INVITADO = ["Pendiente", "Confirmado", "Rechazado"] as const;
export type EstadoConfirmacionInvitado = (typeof ESTADOS_CONFIRMACION_INVITADO)[number];

export const ESTADOS_CONTRATO = ["Cotizado", "Contratado", "Pagado", "Cancelado"] as const;
export type EstadoContrato = (typeof ESTADOS_CONTRATO)[number];

export const METODOS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "QR"] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];

export const REGISTRADO_POR = ["Cliente", "Administrador"] as const;
export type RegistradoPor = (typeof REGISTRADO_POR)[number];

export const ESTADOS_PAGO_CLIENTE = ["Reportado", "Validado", "Rechazado"] as const;
export type EstadoPagoCliente = (typeof ESTADOS_PAGO_CLIENTE)[number];
