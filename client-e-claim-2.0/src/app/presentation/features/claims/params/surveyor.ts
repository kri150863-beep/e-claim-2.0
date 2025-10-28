
import { ExportHeader } from "../../../../core/shared/utils/export.util"
import { Payment } from "../../../../core/domain/entities/payment.entity"

interface SurveyorClaimColumnProp {
    id: string;
    label?: string; /** If label is not provided, the column will be hidden */
    sortable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    dataFormat?: (value: any) => any;
    specialType?: "download" | "status" | "claim";
}

const getSurveyorParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {
    
    const getClaimAmount = (amount: number): string => {
        if (!amount) return numberFormat(0)
        let claimAmount: number =  amount + amount*vat/100 
        return numberFormat(claimAmount)
    }
    
    const columnProps: SurveyorClaimColumnProp[] = [
        { id: "received_date", label: "Date Received", sortable: true },
        { id: "number", label: "Claim n°", searchable: true },
        { id: "name", label: "Name", searchable: true },
        { id: "registration_number", label: "Registration n°", searchable: true },
        { id: "phone", label: "Mobile n°", searchable: true },
        { id: "ageing", label: "Ageing", sortable: true },
        { id: "status_name", label: "Status", filterable: true, specialType: "status" },
        { id: "action", label: "", specialType: "claim" },
    ]

    const kebab: any = {
        "In progress": [{ id: "download", label: "Download" }],
        "Queries": [{ id: "additionalParts", label: "Additional parts" }],
        "Completed": [{ id: "download", label: "Download" }],
        "New": [{ id: "createReport", label: "Create report" }, {id: "returnClaim", label: "Return Claim"}],
        "Draft": [{ id: "resume", label: "Resume" }],
    }

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

    const currency = "Rs"
    return { columnProps, exportColumns, kebab, detailsFields, inputDetailsFields, pTableDatas, currency, tableDatas }
}

export default getSurveyorParams