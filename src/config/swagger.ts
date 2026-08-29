import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

// glob (usado internamente por swagger-jsdoc) requiere rutas con forward slash;
// path.join genera backslashes en Windows, por lo que no matchea ningún archivo
// si no se normalizan.
const normalizar = (p: string) => p.split(path.sep).join("/");

const rutasGlob = [
  normalizar(path.join(__dirname, "../routes/*.ts")),
  normalizar(path.join(__dirname, "../routes/*.js")),
];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Organización de Eventos — API",
      version: "1.0.0",
      description:
        "API REST del backend del Sistema de Organización de Eventos",
    },
    servers: [{ url: "/api", description: "Servidor actual" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer" },
            rol: { type: "string", enum: ["administrador", "cliente"] },
            email: { type: "string", format: "email" },
            nombre: { type: "string" },
          },
        },
        Cliente: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            email: { type: "string", format: "email" },
            telefono: { type: "string", nullable: true },
            activo: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        TipoEvento: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            activo: { type: "boolean" },
          },
        },
        CategoriaProveedor: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            activo: { type: "boolean" },
          },
        },
        Evento: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre: { type: "string" },
            id_tipo_evento: { type: "integer" },
            id_cliente: { type: "integer" },
            fecha_inicio: { type: "string", format: "date" },
            fecha_fin: { type: "string", format: "date" },
            ubicacion: { type: "string" },
            capacidad_estimada: { type: "integer", nullable: true },
            presupuesto_estimado: { type: "string", nullable: true },
            descripcion: { type: "string", nullable: true },
            estado: {
              type: "string",
              enum: ["Planificado", "Confirmado", "En curso", "Finalizado", "Cancelado"],
            },
            dias_anticipacion_recordatorio: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Invitado: {
          type: "object",
          properties: {
            id: { type: "integer" },
            id_evento: { type: "integer" },
            nombre: { type: "string" },
            apellido: { type: "string" },
            email: { type: "string", nullable: true },
            telefono: { type: "string", nullable: true },
            acompanantes_permitidos: { type: "integer" },
            acompanantes_confirmados: { type: "integer", nullable: true },
            notas_especiales: { type: "string", nullable: true },
            estado_confirmacion: { type: "string", enum: ["Pendiente", "Confirmado", "Rechazado"] },
            token_confirmacion: { type: "string" },
            fecha_respuesta: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Proveedor: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nombre_empresa: { type: "string" },
            id_categoria: { type: "integer" },
            contacto_nombre: { type: "string", nullable: true },
            telefono: { type: "string", nullable: true },
            email: { type: "string", nullable: true },
            activo: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        EventoProveedor: {
          type: "object",
          properties: {
            id: { type: "integer" },
            id_evento: { type: "integer" },
            id_proveedor: { type: "integer" },
            descripcion_servicio: { type: "string", nullable: true },
            costo_acordado: { type: "string" },
            fecha_servicio: { type: "string", format: "date" },
            hora_inicio: { type: "string", nullable: true },
            hora_fin: { type: "string", nullable: true },
            cantidad: { type: "integer", nullable: true },
            estado_contrato: {
              type: "string",
              enum: ["Cotizado", "Contratado", "Pagado", "Cancelado"],
            },
            created_at: { type: "string", format: "date-time" },
          },
        },
        PlanPago: {
          type: "object",
          properties: {
            id: { type: "integer" },
            id_evento: { type: "integer" },
            numero_cuota: { type: "integer" },
            monto: { type: "string" },
            fecha_limite: { type: "string", format: "date" },
            pagada: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        PagoCliente: {
          type: "object",
          properties: {
            id: { type: "integer" },
            id_evento: { type: "integer" },
            id_cuota: { type: "integer", nullable: true },
            monto: { type: "string" },
            fecha_pago: { type: "string", format: "date" },
            metodo_pago: { type: "string", enum: ["Efectivo", "Transferencia", "Tarjeta", "QR"] },
            comprobante_url: { type: "string", nullable: true },
            registrado_por: { type: "string", enum: ["Cliente", "Administrador"] },
            estado: { type: "string", enum: ["Reportado", "Validado", "Rechazado"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
        PagoProveedor: {
          type: "object",
          properties: {
            id: { type: "integer" },
            id_evento_proveedor: { type: "integer" },
            monto: { type: "string" },
            fecha_pago: { type: "string", format: "date" },
            metodo_pago: { type: "string", enum: ["Efectivo", "Transferencia", "Tarjeta", "QR"] },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: rutasGlob,
};

export const swaggerSpec = swaggerJsdoc(options);
