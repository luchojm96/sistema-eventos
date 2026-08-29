import { AppDataSource } from "../config/data-source";
import { PlanPago } from "../entities/PlanPago";

export const planPagoRepository = () => AppDataSource.getRepository(PlanPago);
