import { Payment } from "../../../../../core/domain/entities/payment.entity";
import { ExportHeader } from "../../../../../core/shared/utils/export.util";

export interface DialogData {
    role: string
    payments: Payment[]
    exportColumns: ExportHeader[]
}