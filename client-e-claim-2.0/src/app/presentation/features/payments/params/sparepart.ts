import { Part, Payment } from "../../../../core/domain/entities/payment.entity"
import { PaymentStatus } from "../../../../core/shared/constants/payment-status.const"
import { ExportHeader } from "../../../../core/shared/utils/export.util"

interface SparePartPaymentColumnProp {
    id: string
    label?: string /** If label is not provided, the column will be hidden */
    sortable?: boolean
    searchable?: boolean
    filterable?: boolean
    dataFormat?: (value: any) => any
    specialType?: "download" | "status"
}

const getSparePartParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {

    const getClaimAmount= (parts: Part[]): string => {
        let claimAmount: number = 0
        parts.forEach(({ cost }) => claimAmount += cost /*+ cost*this.vat/100*/ )
        return numberFormat(claimAmount)
    }

    const getTotal = (parts: Part[]): string => {
        let claimAmount: number = 0
        parts.forEach(({ cost }) => claimAmount += cost + cost* vat/100 )
        return numberFormat(claimAmount)
    }
    
    const columnProps: SparePartPaymentColumnProp[] = [
        { id: "createdAt", label: "Date received", sortable: true, dataFormat: dateFormat},
        { id: "submitDate", label: "Date submitted", sortable: true, dataFormat: dateFormat},
        { id: "invoiceId", label: "Invoice n°", searchable: true },
        { id: "claimId", label: "Claim n°", searchable: true },
        { id: "parts", label: "Claim Amount (MUR)", searchable: true, dataFormat: getClaimAmount },
        { id: "status", label: "Status", filterable: true, specialType: "status" },
        { id: "action", label: "", specialType: "download", },
      
    ]
      
    const exportColumns: ExportHeader[] = [
        { id: "createdAt", label: "Date received" },
        { id: "submitDate", label: "Date submitted" },
        { id: "invoiceId", label: "Invoice Number" },
        { id: "parts", label: "Amount" },
        
    ]

    const detailsFields = (payment?: Payment) => {
        if (!payment) return []
        return [
            { id: "client", label: "Name", value: payment["client"] },
            { id: "claimHandler", label: "SWAN Claim Handler", value: payment["claimHandler"] },
            { id: "invoiceId", label: "Invoice number", value: payment["invoiceId"] },
            { id: "claimId", label: "Claim number", value: payment["claimId"] },
            { id: "vehicleId", label: "Vehicle Registration no", value: payment["vehicleId"] },
            { id: "createdAt", label: "Invoice Date", value: dateFormat(payment["createdAt"]) },
            { id: "garageName", label: "Name of the Garage", value: payment["garageName"] },
        ]
    }

    const inputDetailsFields= (payment?: Payment) => {
        if (!payment) return []
        return [
            { id: "client", label: "Name", value: payment["client"] },
            { id: "claimHandler", label: "SWAN Claim Handler", value: payment["claimHandler"] },
            { id: "createdAt", label: "Invoice Date", value: dateFormat(payment["createdAt"]) },
            { id: "claimId", label: "Claim number", value: payment["claimId"] },
            { id: "vehicleId", label: "Vehicle Registration no", value: payment["vehicleId"] },
            { id: "garageName", label: "Name of the Garage", value: payment["garageName"] },
        ]
    }
    
    const tableDatas = (payment: Payment) => {
        return [
        ]
    }

    const pTableDatas = (payment: Payment) => {
        const paidHeaders = [
            { id: "name", label: "Part name" },
            { id: "quantity", label: "Quantity" },
            { id: "quality", label: "Quality" },
            { id: "cost", label: "Unit price" },
            { id: "vat", label: "VAT %" },
            { id: "discount", label: "Discount" },
            { id: "total", label: "Total (MUR)" },
        ]
        const othersHeaders = [ // new, submitted, under review
            { id: "name", label: "Part name" },
            { id: "quantity", label: "Quantity" },
            { id: "quality", label: "Quality" },
            { id: "availability", label: "Availability" },
            { id: "cost", label: "Cost (MUR)" },
            { id: "discount", label: "Discount %" },
            { id: "vat", label: "VAT %" },
            { id: "total", label: "Total (MUR)" },
        ]
        return {
            headers: (payment.status !== PaymentStatus.PAID) ? paidHeaders : othersHeaders,
            rows: payment.parts?.map((part) => { return {
                ...part,
                vat: numberFormat(vat),
                discount: part.discount ? numberFormat(part.discount) : "-",
                total: numberFormat(part.cost + part.cost * vat/100)
            } }),
            footerRows: [
                {
                    name: "Total",
                    total: getTotal(payment.parts ?? [])
                }
            ]
        }
    }
    
    const paymentTitle = "Payment Overview"
    const currency = "MUR"
    const listTitle = "Payments list"
    return { columnProps, exportColumns, detailsFields, inputDetailsFields, pTableDatas, paymentTitle, currency, listTitle, tableDatas }
}
export default getSparePartParams