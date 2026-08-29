import path from "path";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import clienteRoutes from "./routes/cliente.routes";
import eventoRoutes from "./routes/evento.routes";
import tipoEventoRoutes from "./routes/tipoEvento.routes";
import invitadoRoutes from "./routes/invitado.routes";
import rsvpRoutes from "./routes/rsvp.routes";
import proveedorRoutes from "./routes/proveedor.routes";
import categoriaProveedorRoutes from "./routes/categoriaProveedor.routes";
import eventoProveedorRoutes from "./routes/eventoProveedor.routes";
import pagoRoutes from "./routes/pago.routes";
import reporteRoutes from "./routes/reporte.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Orden importa: las rutas públicas y las de prefijo específico van antes que
// los routers montados en el prefijo genérico "/api", ya que esos routers
// aplican requireAuth sin filtro de sub-ruta y de lo contrario interceptarían
// cualquier ruta registrada después de ellos.
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/tipos-evento", tipoEventoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/categorias-proveedor", categoriaProveedorRoutes);
app.use("/api/reportes", reporteRoutes);

app.use("/api", eventoRoutes);
app.use("/api", invitadoRoutes);
app.use("/api", eventoProveedorRoutes);
app.use("/api", pagoRoutes);

app.use(errorHandler);

export default app;
