export type SortDirection = "asc" | "desc"
export type SpecialType = "status" | "download" | "claim"

export type Header = {
    id: string,
    label: string
    sortable?: boolean
    searchable?: boolean
    filterable?: boolean
    specialType?: SpecialType
}