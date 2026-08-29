import ExcelJS from "exceljs";

export interface FilaInvitado {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  acompanantes_permitidos?: number;
  notas_especiales?: string;
}

function normalizarValor(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "object" && "text" in (valor as Record<string, unknown>)) {
    return String((valor as { text: unknown }).text ?? "");
  }
  return String(valor).trim();
}

function filasDesdeCsv(texto: string): Record<string, string>[] {
  const lineas = texto.split(/\r?\n/).filter((linea) => linea.trim() !== "");
  if (lineas.length === 0) return [];

  const encabezados = lineas[0].split(",").map((h) => h.trim().toLowerCase());
  return lineas.slice(1).map((linea) => {
    const valores = linea.split(",");
    const fila: Record<string, string> = {};
    encabezados.forEach((encabezado, index) => {
      fila[encabezado] = (valores[index] ?? "").trim();
    });
    return fila;
  });
}

async function filasDesdeXlsx(buffer: Buffer): Promise<Record<string, string>[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const hoja = workbook.worksheets[0];
  if (!hoja) return [];

  const encabezados: string[] = [];
  const filas: Record<string, string>[] = [];

  hoja.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell((cell, colNumber) => {
        encabezados[colNumber] = normalizarValor(cell.value).toLowerCase();
      });
      return;
    }

    const fila: Record<string, string> = {};
    row.eachCell((cell, colNumber) => {
      const clave = encabezados[colNumber];
      if (clave) {
        fila[clave] = normalizarValor(cell.value);
      }
    });
    filas.push(fila);
  });

  return filas;
}

function mapearFila(fila: Record<string, string>): FilaInvitado {
  return {
    nombre: fila.nombre ?? "",
    apellido: fila.apellido ?? "",
    email: fila.email || undefined,
    telefono: fila.telefono || undefined,
    acompanantes_permitidos: fila.acompanantes_permitidos ? Number(fila.acompanantes_permitidos) : undefined,
    notas_especiales: fila.notas_especiales || undefined,
  };
}

export async function parseInvitadosFile(buffer: Buffer, filename: string): Promise<FilaInvitado[]> {
  const esCsv = filename.toLowerCase().endsWith(".csv");
  const filas = esCsv ? filasDesdeCsv(buffer.toString("utf-8")) : await filasDesdeXlsx(buffer);
  return filas.map(mapearFila).filter((fila) => fila.nombre && fila.apellido);
}
