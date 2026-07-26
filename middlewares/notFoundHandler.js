import { AppError } from '../errors/AppError.js';
export function notFoundHandler(req, res, next) {
 const error = new AppError(
  `Ruta no encontrada: ${req.originalUrl}`,
  404
);
  next(error);
}
