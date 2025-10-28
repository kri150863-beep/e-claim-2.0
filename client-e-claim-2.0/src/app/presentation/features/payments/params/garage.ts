import { Payment, RepairItem } from "../../../../core/domain/entities/payment.entity"
import { ExportHeader } from "../../../../core/shared/utils/export.util"

interface GaragePaymentColumnProp {
    id: string
    label?: string /** If label is not provided, the column will be hidden */
    sortable?: boolean
    searchable?: boolean
    filterable?: boolean
    dataFormat?: (value: any) => any
    specialType?: "download" | "status"
}

const getGarageParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {
    
    const getClaimAmount= (repairItems: RepairItem[]): string => {
        let claimAmount: number = 0
        repairItems.forEach(({ amount }) => claimAmount += amount /*+ amount*this.vat/100*/ )
        return numberFormat(claimAmount)
    }
    
    const columnProps: GaragePaymentColumnProp[] = [
        { id: "createdAt", label: "Date received", sortable: true, dataFormat: dateFormat},
        { id: "invoiceId", label: "Invoice n°", searchable: true },
        { id: "claimId", label: "Claim n°", searchable: true },
        { id: "repairItems", label: "Claim Amount (MUR)", searchable: true, dataFormat: getClaimAmount },
        { id: "paymentDate", label: "Payment date", sortable: true, dataFormat: dateFormat },
        { id: "status", label: "Status", filterable: true, specialType: "status" },
        { id: "action", label: "", specialType: "download", },   
    ]
      
    const exportColumns: ExportHeader[] = [
        { id: "createdAt", label: "Date" },
        { id: "claimId", label: "Claim number" },
        { id: "invoiceId", label: "Invoice number" },
        { id: "repairItems", label: "Amount" }
    ]

    const detailsFields = (payment?: Payment) => {
        if (!payment) return []
        return [
            { id: "invoiceId", label: "Invoice Number", value: payment["invoiceId"] },
            { id: "client", label: "Client", value: payment["client"] },
            { id: "claimHandler", label: "SWAN Claim Handler", value: payment["claimHandler"] },
            { id: "createdAt", label: "Invoice Date", value: dateFormat(payment["createdAt"]) },
            { id: "vehicleId", label: "Vehicle Registration Number", value: payment["vehicleId"] },
        ]
    }

    const inputDetailsFields= () => {
        return []
    }
    
    const tableDatas = (payment: Payment) => {
        const { repairItems } = payment
        let [ totalAmount, totalVat ] = [0, 0]
        const lines = repairItems?.map(({ name, amount }) =>{
          const vatAmount = amount *vat / 100
          totalAmount += amount
          totalVat += vatAmount
          return [ name, numberFormat(amount), numberFormat(vatAmount), numberFormat(amount + vatAmount) ]
        }) ?? []
        return [
          [ "Repair items", "Amount (MUR)", "VAT %", "Total (MUR)" ],
          ...lines,
          [ "Grand total", numberFormat(totalAmount), numberFormat(totalVat), numberFormat(totalAmount + totalVat) ]
        ]
    }

    const pTableDatas = (payment: Payment) => {
        return {
        }
    }
    
    const paymentTitle = "Payment Overview"
    const currency = "MUR"
    const listTitle = "Payments list"
    return { columnProps, exportColumns, detailsFields, inputDetailsFields, pTableDatas, paymentTitle, currency, listTitle, tableDatas }
}
export default getGarageParams