export const PaymentStatus = {
    NEW: "New",
    UNDER_REVIEW: "Under review",
    SUBMITTED: "Submitted",
    PAID: "Paid",
    APPROVED: "Approved"
  } as const
  
  export type Status = typeof PaymentStatus[keyof typeof PaymentStatus];