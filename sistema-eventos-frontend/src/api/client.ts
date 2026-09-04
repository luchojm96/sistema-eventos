const API_URL = import.meta.env.VITE_API_URL;

// El backend sirve los comprobantes subidos como archivos estáticos en su
// origen (no bajo /api) — se usa para armar el link de descarga completo.
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
}

/**
 * Wrapper sobre fetch: agrega credentials:'include' (cookie httpOnly del
 * backend), serializa el body a JSON salvo que sea multipart (isFormData),
 * y normaliza los errores del backend ({ message }) en ApiError.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, isFormData = false } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : undefined;

  if (!response.ok) {
    throw new ApiError(data?.message ?? "Error de conexión con el servidor", response.status);
  }

  return data as T;
}
