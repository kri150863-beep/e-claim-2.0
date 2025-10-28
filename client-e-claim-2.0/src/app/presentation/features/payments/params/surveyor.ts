
import { ExportHeader } from "../../../../core/shared/utils/export.util"
import { Payment } from "../../../../core/domain/entities/payment.entity"

interface SurveyorPaymentColumnProp {
    id: string
    label?: string /** If label is not provided, the column will be hidden */
    sortable?: boolean
    searchable?: boolean
    filterable?: boolean
    dataFormat?: (value: any) => any
    specialType?: "download" | "status"
}

const getSurveyorParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {
    
    const getClaimAmount = (amount: number): string => {
        if (!amount) return numberFormat(0)
        let claimAmount: number =  amount + amount*vat/100 
        return numberFormat(claimAmount)
    }
    
    const columnProps: SurveyorPaymentColumnProp[] = [
        { id: "createdAt", label: "Date Submitted", sortable: true, dataFormat: dateFormat },
        { id: "invoiceId", label: "Invoice n°", searchable: true },
        { id: "claimId", label: "Claim n°", searchable: true },
        { id: "claimAmount", label: "Claim Amount (MUR)", searchable: true, dataFormat: numberFormat },
        { id: "paymentDate", label: "Payment date", sortable: true, dataFormat: dateFormat },
        { id: "status", label: "Status", filterable: true, specialType: "status" },
        { id: "action", label: "", specialType: "download" },
    ]
    const exportColumns: ExportHeader[] = [
        { id: "createdAt", label: "Date" },
        { id: "claimId", label: "Claim number" },
        { id: "registrationId", label: "Registration number" },
        { id: "invoiceId", label: "Invoice number" },
        { id: "claimAmount", label: "Amount" }
    ]
    const detailsFields = (payment?: Payment) => {
        if (!payment) return []
        return [
            { id: "createdAt", label: "Invoice date", value: dateFormat(payment["createdAt"]) },
            { id: "client", label: "Client", value: payment["client"] },
            { id: "attention", label: "Attention", value: payment["attention"] },
            { id: "invoiceId", label: "Invoice number", value: payment["invoiceId"] },
            { id: "vehicleId", label: "Vehicle reg number", value: payment["vehicleId"] },
        ]
    }

    const inputDetailsFields= () => {
        return []
    }
    
    const tableDatas = (payment: Payment) => {
        const { claimAmount=0 } = payment
            return [
            [ "Amount", `Rs ${numberFormat(claimAmount)}` ],
            [ "VAT", `${numberFormat(vat)}%` ],
            [ "Total", `Rs ${getClaimAmount(claimAmount)}` ]
        ]
    }

    const pTableDatas = (payment: Payment) => {
        return {
        }
    }

    const paymentTitle = "Payments"
    const currency = "Rs"
    const listTitle = "Payments list"
    return { columnProps, exportColumns, detailsFields, inputDetailsFields, pTableDatas, paymentTitle, currency, listTitle, tableDatas }
}

export default getSurveyorParams