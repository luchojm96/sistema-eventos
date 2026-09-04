import { RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { AppError } from "../utils/AppError";

function formatearErrores(errores: ValidationError[]): string[] {
  return errores.flatMap((error) => {
    const mensajes = Object.values(error.constraints ?? {});
    const anidados = error.children?.length ? formatearErrores(error.children) : [];
    return [...mensajes, ...anidados];
  });
}

/**
 * Equivalente al ValidationPipe de NestJS: transforma req.body a una instancia
 * de la clase DTO (coercionando tipos, ej. strings de multipart/form-data a
 * number/boolean) y la valida con class-validator. Si hay errores, corta la
 * cadena con un 400. Si no, reemplaza req.body por la instancia ya validada
 * (whitelist: true descarta cualquier campo no declarado en el DTO, cerrando
 * la puerta a mass-assignment).
 */
export function validateBody<T extends object>(DtoClass: new () => T): RequestHandler {
  return async (req, _res, next) => {
    const instancia = plainToInstance(DtoClass, req.body, { enableImplicitConversion: true });
    const errores = await validate(instancia as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errores.length > 0) {
      next(new AppError(formatearErrores(errores).join("; "), 400));
      return;
    }

    req.body = instancia;
    next();
  };
}
