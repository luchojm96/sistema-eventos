import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

import app from "./app";
import { AppDataSource } from "./config/data-source";

const PORT = process.env.PORT ?? 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("Conexión a la base de datos establecida");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  });
