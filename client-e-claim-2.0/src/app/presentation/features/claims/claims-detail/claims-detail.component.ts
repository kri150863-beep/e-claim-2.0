
import { Component, OnInit } from "@angular/core";

import { ClaimsInfoComponent } from "../components/component-info/claims-info.component";
import { ClaimsEstimationComponent } from "../components/component-estimation/claims-estimation.component";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from "../../../shared/ui/button/button.component";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../../../core/infrastructure/services/auth.service";
import { ClaimService } from "../../../../core/infrastructure/services/claim.service";
import { Observable } from "rxjs";
import { ClaimStatus } from "../../../../core/shared/constants/claim-status";
import { ClaimsDocumentComponent } from "../components/component-document/claims-document.component";


enum Views {
  INFORMATION = "INFORMATION",
  ESTIMATION = "ESTIMATION",
  DOCUMENT = "DOCUMENT",
}

@Component({
  imports: [
    CommonModule,
    ClaimsInfoComponent,
    ClaimsEstimationComponent,
    ClaimsDocumentComponent,
    RouterModule,
    MatIconModule,
    ButtonComponent,
  ],
  selector: 'app-claims-detail',
  templateUrl: './claims-detail.component.html',
  styleUrls: ['./claims-detail.component.scss']
})
export class ClaimsDetailComponent implements OnInit{

  ViewType = Views;
  activeView: string = Views.INFORMATION
  claimId: string = "";
  claim$!: Observable<any>;
  claim!: any;

  statusSeverity = {
    primary: [ClaimStatus.IN_PROGRESS],
    warning: [ClaimStatus.QUERIES],
    success: [ClaimStatus.COMPLETED],
    info: [ClaimStatus.NEW],
    yellow: [ClaimStatus.DRAFT]
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private claimService: ClaimService
  ) {
    this.claim$ = this.claimService.claim$;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.claimId = params['id'];
    });

    this.loadClaimDetails();
    this.claim$.subscribe({
      next: (response) => {
        this.claim = response.data;
      },
      error: (error) => console.error(error)
    });
  }

  onToggle(view: string) {
    this.activeView = view
  }

  onBackToClaimList() {
    console.log("now redirect")
    this.router.navigate(['dashboard/claims']);
  }

  loadClaimDetails() {
    const user = this.authService.getCurrentUser();
    this.claimService.getClaimById({claimNo: this.claimId, email: user?.username ?? ''});
  }

  getKeyByValue(statusValue: string): string | undefined {
    return Object.entries(this.statusSeverity).find(
        ([key, values]: any) => values.includes(statusValue)
      )?.[0];
  }
}