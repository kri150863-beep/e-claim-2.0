import { Status } from "../../shared/constants/payment-status.const";

export interface Payment {
  id: string;
  createdAt: string
  invoiceId?: string | number
  claimId: string
  paymentDate?: string
  status: Status
  client?: string
  vehicleId?: string
  
  // surveyor
  claimAmount?: number
  attention?: string // + car rental
  registrationId?: string // + car rental

  // garage
  repairItems?: RepairItem[]
  claimHandler?: string // + spare_part

  // spare part
  submitDate?: string
  parts?: Part[]
  garageName?: string
  discount?: number

  // car rental
  make?: string
  model?: string
  rentalId?: string
  rentalStartDate?: string
  rentals?: Rental[]

}

export interface RepairItem {
  name: string
  amount: number
}

export interface Part {
  name: string
  quantity: number
  quality: string
  availability: string
  discount?: number
  cost: number
}

export interface Rental {
  description: string
  vehicleId: string
  days: number
  dailyRate: number
  discount?: number
}