import fs from "fs";
import path from "path";
import { swaggerSpec } from "../config/swagger";

const destino = path.join(__dirname, "../../openapi.json");
fs.writeFileSync(destino, JSON.stringify(swaggerSpec, null, 2), "utf-8");
console.log(`Spec OpenAPI exportada a ${destino}`);
