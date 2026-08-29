import fs from "fs";
import path from "path";
import multer from "multer";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "comprobantes");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const sufijo = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${sufijo}${path.extname(file.originalname)}`);
  },
});

export const uploadComprobante = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extensionesPermitidas = [".pdf", ".jpg", ".jpeg", ".png"];
    const valido = extensionesPermitidas.some((ext) => file.originalname.toLowerCase().endsWith(ext));
    cb(null, valido);
  },
});

export function urlComprobante(filename: string): string {
  return `/uploads/comprobantes/${filename}`;
}
