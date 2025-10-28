import { Payment, Rental } from "../../../../core/domain/entities/payment.entity"
import { ExportHeader } from "../../../../core/shared/utils/export.util"

interface CarRentalClaimColumnProp {
    id: string;
    label?: string; /** If label is not provided, the column will be hidden */
    sortable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    dataFormat?: (value: any) => any;
    specialType?: "download" | "status" | "claim";
}

const getCarRentalParams = (vat: number, numberFormat: (val: number) => string, dateFormat: (value: string)=> string) => {

    const getAmount= (rentals: Rental[]): string => {
        let amount: number = 0
        rentals.forEach(({ days, dailyRate, discount }) => amount += dailyRate * days - (discount ?? 0) /*+ cost*this.vat/100*/ )
        return numberFormat(amount)
    }
    
    const columnProps: CarRentalClaimColumnProp[] = [
        { id: "dateReceived", label: "Date Received", sortable: true, dataFormat: dateFormat },
        { id: "claimNumber", label: "Claim n°", searchable: true },
        { id: "name", label: "Name", searchable: true },
        { id: "registrationNumber", label: "Registration n°", searchable: true },
        { id: "mobileNumber", label: "Mobile n°", searchable: true },
        { id: "ageing", label: "Ageing", sortable: true },
        { id: "status", label: "Status", filterable: true, specialType: "status" },
        { id: "action", label: "", specialType: "claim" },
    ]
      
    const exportColumns: ExportHeader[] = [
    ]
    
    const detailsFields = (payment?: Payment) => {
        if (!payment) return []
        const { rentals } = payment
        const totalDays = (() => {
            let days = 0
            rentals?.forEach(({ days: d }) => days += d)
            return days
        })()
        const getEndDay = (startDate: string) => {
            const date = new Date(startDate)
            date.setDate(date.getDate() + totalDays)
        
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
        
            return dateFormat(`${month}-${day}-${year}`)
        }
        return [
            { id: "attention", label: "Attention", value: payment["attention"] },
            { id: "invoiceId", label: "Invoice number", value: payment["invoiceId"] },
            { id: "createdAt", label: "Date received", value: dateFormat(payment["createdAt"]) },
            { id: "claimId", label: "Claim number", value: payment["claimId"] },
            { id: "rentalId", label: "Rental number", value: payment["rentalId"] },
            { id: "rentalStartDate", label: "Rental start date", value: payment["rentalStartDate"] ? dateFormat(payment["rentalStartDate"]) : "" },
            { id: "rentalEndDate", label: "Rental end date", value: payment["rentalStartDate"] ? getEndDay(payment["rentalStartDate"]) : "" },
            { id: "totalDays", label: "Total rental days", value: totalDays.toString() },
            { id: "client", label: "Client name", value: payment["client"] },
        ]
    }

    const inputDetailsFields= () => {
        return []
    }
    
    const tableDatas = (payment: Payment) => {
        const { rentals } = payment
        let [ totalAmount, totalDays, totalDiscount ] = [0, 0, 0]
        const lines = rentals?.map(({ description, vehicleId, days, dailyRate, discount }) =>{
            const amount = dailyRate * days - (discount ?? 0)
            totalAmount += amount
            totalDays += days
            totalDiscount += discount ?? 0
            return [ description, vehicleId, days.toString(), numberFormat(dailyRate), discount ? discount.toString() : "-", vat.toString(), numberFormat(amount) ]
        }) ?? []
        return [
            [ "Description", "Vehicle registration", "Days", "Daily rate", "Discount", "VAT %", "Amount (MUR)" ],
            ...lines,
            [ "Total", "", totalDays.toString(), numberFormat(totalAmount / totalDays), totalDiscount.toString(), "", numberFormat(totalAmount) ]
        ]
    }

    const pTableDatas = (payment: Payment) => {
        return {}
    }
    
    const currency = "MUR"
    return { columnProps, exportColumns, detailsFields, inputDetailsFields, pTableDatas, currency, tableDatas }
}
export default getCarRentalParams