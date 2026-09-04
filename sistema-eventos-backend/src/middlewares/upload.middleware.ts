import multer from "multer";

export const uploadInvitados = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extensionesPermitidas = [".csv", ".xlsx"];
    const valido = extensionesPermitidas.some((ext) => file.originalname.toLowerCase().endsWith(ext));
    cb(null, valido);
  },
});
