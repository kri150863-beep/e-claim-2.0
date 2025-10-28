import { Payment, RepairItem } from "../../../../core/domain/entities/payment.entity"
import { ExportHeader } from "../../../../core/shared/utils/export.util"

interface GarageClaimColumnProp {
    id: string;
    label?: string; /** If label is not provided, the column will be hidden */
    sortable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    dataFormat?: (value: any) => any;
    specialType?: "download" | "status" | "claim";
}

const getGarageParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {
    
    const getClaimAmount= (repairItems: RepairItem[]): string => {
        let claimAmount: number = 0
        repairItems.forEach(({ amount }) => claimAmount += amount /*+ amount*this.vat/100*/ )
        return numberFormat(claimAmount)
    }
    
    const columnProps: GarageClaimColumnProp[] = [
        { id: "dateReceived", label: "Date Received", sortable: true, dataFormat: dateFormat },
        { id: "claimNumber", label: "Claim n°", searchable: true },
        { id: "name", label: "Name", searchable: true },
        { id: "registrationNumber", label: "Registration n°", searchable: true },
        { id: "mobileNumber", label: "Mobile n°", searchable: true },
        { id: "ageing", label: "Ageing", sortable: true },
        { id: "status", label: "Status", filterable: true, specialType: "status" },
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
    
    const currency = "MUR"
    return { columnProps, exportColumns, kebab, detailsFields, inputDetailsFields, pTableDatas, currency, tableDatas }
}
export default getGarageParams