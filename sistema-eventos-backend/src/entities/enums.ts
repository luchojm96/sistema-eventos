export enum EstadoEvento {
  PLANIFICADO = "Planificado",
  CONFIRMADO = "Confirmado",
  EN_CURSO = "En curso",
  FINALIZADO = "Finalizado",
  CANCELADO = "Cancelado",
}

export enum EstadoConfirmacionInvitado {
  PENDIENTE = "Pendiente",
  CONFIRMADO = "Confirmado",
  RECHAZADO = "Rechazado",
}

export enum EstadoContrato {
  COTIZADO = "Cotizado",
  CONTRATADO = "Contratado",
  PAGADO = "Pagado",
  CANCELADO = "Cancelado",
}

export enum MetodoPago {
  EFECTIVO = "Efectivo",
  TRANSFERENCIA = "Transferencia",
  TARJETA = "Tarjeta",
  QR = "QR",
}

export enum RegistradoPor {
  CLIENTE = "Cliente",
  ADMINISTRADOR = "Administrador",
}

export enum EstadoPagoCliente {
  REPORTADO = "Reportado",
  VALIDADO = "Validado",
  RECHAZADO = "Rechazado",
}
