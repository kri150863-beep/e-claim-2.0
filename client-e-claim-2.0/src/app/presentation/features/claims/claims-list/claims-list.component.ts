import { Observable } from "rxjs";
import { Component, computed, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

import { ClaimService } from "../../../../core/infrastructure/services/claim.service";
import { CardItem, Claim } from "../../../../core/domain/entities/claim.entity";
import { CommonModule, formatDate } from "@angular/common";

import { LucideAngularModule } from "lucide-angular";

import {
  EllipsisVertical,
  ChevronsUpDown,
  Search
} from 'lucide-angular';
import { StatusCardComponent } from "../../../shared/ui/card/status-card/status-card.component";
import { TableComponent } from "../../../shared/ui/table/table.component";
import { AuthService } from "../../../../core/infrastructure/services/auth.service";
import { UserRoles } from "../../../../core/shared/constants/roles.const";
import getSurveyorParams from "../params/surveyor";
import getGarageParams from "../params/garage";
import getSparePartParams from "../params/sparepart";
import { SortDirection } from "../../../shared/ui/table/table.types";
import { ClaimStatus } from "../../../../core/shared/constants/claim-status";
import { EventBusService } from "../../../../core/infrastructure/services/event-bus.service";
@Component({
  selector: 'app-claims-list',
  imports: [
    CommonModule,
    LucideAngularModule,
    StatusCardComponent,
    TableComponent,
    RouterModule
  ],
  templateUrl: './claims-list.component.html',
  styleUrls: ['./claims-list.component.scss']
})
export class ClaimsListComponent implements OnInit {
  overviewTitle: string = "Overview";
  icons = {
    verticalPoint: EllipsisVertical,
    chevronUpdown: ChevronsUpDown,
    search: Search
  }
  statusSeverity = {
    primary: [ClaimStatus.IN_PROGRESS],
    warning: [ClaimStatus.QUERIES],
    success: [ClaimStatus.COMPLETED],
    info: [ClaimStatus.NEW],
    yellow: [ClaimStatus.DRAFT]
  }
  kebab!: any
  listTitle: string = "Claim list";
  vat = 15;
  statusFilterOptions: (keyof typeof ClaimStatus)[] = Object.values(ClaimStatus) as any;
  columnProps: any[] = []
  pTableDatas: (claim: Claim) => any = () => { return {} }
  role!: string
  tableDatas: (payment: Claim) => string[][] = () => { return [] }
  filteredClaims: Claim[] = []
  currentPage = 1
  activeSort: { column: string; direction: SortDirection } = { column: 'received_date', direction: 'asc' }
  filters: { status?: string[], sort?: string } = {}
  currency: string = "Rs"
  currentStatus: string | null = null
  claims$: Observable<{ data: Claim[]; total_claims: number; }>;
  claims!: Claim[];
  cards$!: Observable<CardItem[]>;
  cards!: CardItem[];
  pageSize = 10;
  totalClaims = 0;
  statusFilter: string[] = [];
  sortOption: string | null = null;
  searchTerm: any;
  loadingClaims: boolean = false
  open: boolean = false
  openDropdownIndex: number | null = null;
  displayedColumns: string[] = this.columnProps.map(({ id }) => id)
  displayedColumnProps = computed(() => {
    return this.columnProps.filter(({ label }) => label !== undefined)
  })

  constructor(
    private claimService: ClaimService,
    private router: Router,
    private authService: AuthService,
    private eventBus: EventBusService
  ) {
    this.claims$ = this.claimService.claims$;
  }

  onToggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser()
    const roles = user?.roles ?? []
    let getParams = null;

    if (roles.includes(UserRoles.SURVEYOR)) {
      this.role = UserRoles.SURVEYOR
      getParams = getSurveyorParams
    }
    if (roles.includes(UserRoles.GARAGE)) {
      this.role = UserRoles.GARAGE
      getParams = getGarageParams
    }
    if (roles.includes(UserRoles.SPARE_PARTS)) {
      this.role = UserRoles.SPARE_PARTS
      getParams = getSparePartParams
    }

    if (getParams) {
      const { columnProps, kebab, currency } = getParams(this.vat, this.numberFormat, this.dateFormat)
      this.columnProps = columnProps
      this.currency = currency
      this.kebab = kebab
    }

    this.loadClaims();
    this.claims$.subscribe({
      next: (response) => {
        this.claims = response.data;
        this.totalClaims = response.total_claims;
        this.filteredClaims = response.data;
      },
      error: (error) => console.error(error)
    });

    this.loadCards(user?.username);
    this.claimService.cards$.subscribe({
      next: (response) => {
        this.cards = response;
      },
      error: (error) => console.error(error)
    })

  }

  loadCards(email: any) {
    this.claimService.loadCards(email);
  }

  handleCurrentStatusChange(status: string): void {
    // Toggle status filter if same status is clicked again
    if (!this.statusFilter.includes(status)) {
      this.statusFilter = [status];
      this.currentStatus = status;
    } else {
      this.statusFilter = [];
      this.currentStatus = null;
    }

    // Update filters
    this.filters = {
      ...this.filters,
      status: this.statusFilter || []
    };

    // Reset to first page when filter changes
    this.currentPage = 1;

    // Load claims with updated filters
    this.loadClaims();
  }

  onSort(column: string): void {
    console.log(column);
    // Determine new sort direction
    const newDirection: SortDirection =
      this.activeSort.column === column && this.activeSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    this.activeSort = { column, direction: newDirection }
    // Create sort parameter based on column and direction
    const sort = `${column}-${newDirection}`;

    // Toggle sort off if it's the same as current
    const newSort = this.sortOption === sort ? null : sort;

    // Update filters
    this.filters = {
      ...this.filters,
      sort: newSort || undefined // Convert null to undefined for cleaner params
    };

    // Update sort option (explicitly handling null)
    this.sortOption = newSort;

    // Reset to first page when sort changes
    this.currentPage = 1;

    // Load claims with updated sort
    this.loadClaims();
  }

  onSearch({ column, value }: { column: string, value: string }): void {
    switch (column) {
      case "number":
        this.searchTerm = { column: "searchNum", value };
        break;
      case "name":
        this.searchTerm = { column: "searchName", value };
        break;
      case "registration_number":
        this.searchTerm = { column: "searchRegNum", value };
        break;
      case "phone":
        this.searchTerm = { column: "searchPhone", value };
        break;
      default:
        break;
    }

    this.loadClaims();
  }

  onFilter(status: string[]) {
    this.statusFilter = status;

    this.loadClaims();
  }

  onKebabAction({ action, id }: any) {
    switch (action) {
      case "additionalParts":
        // this.router.navigate(['dashboard/claims-additional-parts']);
        break;
      case "createReport":
        this.onNew(id);
        break;
      case "returnClaim":
        // this.router.navigate(['dashboard/claims-return']);
        break;
      case "resume":
        this.onNew(id);
        break;
      default:
        break;
    }
  }

  redirectToClaimsVerif(claimId: string) {
    this.router.navigate(['dashboard/claims-detail']);
  }

  onClaimsDetail(claimNumber: any) {
    console.log(claimNumber);
    this.router.navigate([`dashboard/claims/${claimNumber}`]);
  }

  onNew(id: string) {
    this.router.navigate([`dashboard/claims-new/${id}`]);
  }

  onTimeColor(status: number): string {

    if (status >= 0 && status <= 24)
      return "text-black-600"

    if (status > 24 && status <= 47)
      return "text-orange-600"

    if (status >= 48)
      return "text-red-600"

    return ""

  }

  onStatusColor(status: string): string {
    let color: string = ""
    switch (status) {
      case "new":
        color = "bg-blue-400"

        break;
      case "draft":
        color = "bg-yellow-400"
        break;

      case "in progress":
        color = "bg-yellow-400"

        break;
      case "completed":
        color = "bg-lime-400"

        break;
      case "additional-request":
        break;
      default:
        color = ""
    }
    return color
  }

  onToggle(status: boolean) {
    this.open = status
  }

  formatDatas(datas: Claim[]) {
    return datas.map((row: Claim) => {
      return Object.keys(row).reduce((acc, key) => {
        const value = row[key as keyof Claim]
        acc[key] = this.formatValue(key, value)
        return acc
      }, {} as Record<string, any>) as Claim
    })
  }

  formatValue(key: string, value: any) {
    const dataFormat = this.columnProps.find(({ id }) => id === key)?.dataFormat
    return dataFormat ? dataFormat(value) : value
  }

  numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format

  dateFormat(value: string): string {
    if (!value) return "-"
    const [month, day, year] = value.split('-')
    const date = new Date(`${year}-${month}-${day}`)
    if (isNaN(date.getTime())) return "-"
    return formatDate(date, 'dd-MMM-yyyy', 'en-US')
  }

  filter(list: Claim[], status: string) {
    return list.filter(({ status_name: s }) => s === status)
  }

  loadClaims(): void {
    this.eventBus.setLoading(true);
    const user = this.authService.getCurrentUser()
    const filter: any = {};
    if (this.statusFilter) filter.status = this.statusFilter;
    if (this.sortOption) filter.sort = this.sortOption || "received_date-desc";
    if (this.searchTerm) filter.search = this.searchTerm;
    
    filter.email = user?.username ?? "";

    this.claimService.loadClaims(this.currentPage, this.pageSize, filter);
    this.eventBus.setLoading(false);
  }

  onStatusFilterChange(status: string): void {
    if (!this.statusFilter.includes(status)) {
      this.statusFilter.push(status);
    } else {
      const index = this.statusFilter.indexOf(status);
      if (index > -1) {
        this.statusFilter.splice(index, 1);
      }
    }
    this.currentPage = 1;
    this.loadClaims();
  }

  onSortChange(sortOption: string): void {
    console.log(sortOption);
    this.sortOption = this.sortOption === sortOption ? null : sortOption;
    this.currentPage = 1;
    this.loadClaims();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClaims();
  }
}