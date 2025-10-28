import { Component, OnInit, ViewChild } from '@angular/core';

import { ClaimsRepaireComponent } from './components/repaire/claims-repaire.component';
import { ClaimsVehiculeComponent } from './components/vehicule/claims-vehicule.component';
import { ClaimsSurveyComponent } from './components/survey/claims-survey.component';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { ClaimsSummaryComponent } from "./components/summary/claims-summary.component";
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, filter, Observable } from 'rxjs';
import { AuthService } from '../../../../core/infrastructure/services/auth.service';
import { ClaimService } from "../../../../core/infrastructure/services/claim.service";

enum Views {
  VEHICLE = 'VEHICLE',
  SURVEY = 'SURVEY',
  REPAIR = 'REPAIR',
  SUMMARY = 'SUMMARY',
}

enum StepType {
  VEHICLE = 'VEHICLE',
  SURVEY = 'SURVEY',
  REPAIR = 'REPAIR',
  SUMMARY = 'SUMMARY',
}

interface Step {
  id: number;
  type: StepType;
  label: string;
  active?: boolean;
  completed?: boolean;
}

@Component({
  imports: [
    CommonModule,
    MatIconModule,
    ClaimsVehiculeComponent,
    ClaimsSurveyComponent,
    ClaimsRepaireComponent,
    ClaimsSummaryComponent
  ],
  selector: 'app-claims-new',
  templateUrl: './claims-new.component.html',
  styleUrls: ['./claims-new.component.scss'],
})
export class ClaimsNewComponent implements OnInit {
  @ViewChild(ClaimsVehiculeComponent) vehicleComponent!: ClaimsVehiculeComponent;
  @ViewChild(ClaimsSurveyComponent) surveyComponent!: ClaimsSurveyComponent;
  @ViewChild(ClaimsRepaireComponent) repairComponent!: ClaimsRepaireComponent;

  ViewType = Views;
  activeView: string = Views.VEHICLE;
  currentStep: number = 1;
  claimId: string = "";
  report$!: Observable<any>;
  report!: any;

  steps: Step[] = [
    { id: 1, type: StepType.VEHICLE, label: 'Vehicle information' },
    { id: 2, type: StepType.SURVEY, label: 'Survey information' },
    { id: 3, type: StepType.REPAIR, label: 'Repair estimate' },
    { id: 4, type: StepType.SUMMARY, label: 'Summary' }
  ];
  user: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private claimService: ClaimService,
    private authService: AuthService) {
    this.report$ = this.claimService.report$;
  }

  ngOnInit() {
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).pipe(
      filter(([params, queryParams]) => !!params && !!queryParams)
    ).subscribe(([params, queryParams]) => {
      this.handleRouteData(params, queryParams);
    });
    // this.activatedRoute.params.subscribe(params => {
    //   this.claimId = params['id'];
    // });

    // const step = this.activatedRoute.snapshot.queryParamMap.get('step');
    // const view = this.activatedRoute.snapshot.queryParamMap.get('view');

    // if (step) {
    //   this.currentStep = parseInt(step);
    // }

    // if (view) {
    //   this.activeView = view;
    // }

    this.user = this.authService.getCurrentUser();
    this.loadClaimReport();
  }

  loadClaimReport() {
    this.claimService.getClaimReport({ claimNo: this.claimId, email: this.user?.username ?? '' });
    this.report$.subscribe({
      next: (response) => {
        this.report = response.data;
      },
      error: (error) => console.error(error)
    });
  }

  onToggle(view: string) {
    if (view == Views.VEHICLE) this.currentStep = 1;
    else this.currentStep += 1;

    this.activeView = view;
  }

  onFormSubmitted(formData?: any) {
    console.log(formData);
    this.claimService.saveClaimReport({
      claimId: this.claimId,
      surveyorId: this.user?.id ?? '',
      status: 1,
      currentStep: `step_${this.currentStep}`,
      reportData: formData
    }).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.error(error)
    });
  }

  async onNext() {
    let isValid = true;
    this.addParamToCurrentUrl();

    switch (this.activeView) {
      case Views.VEHICLE:
        if (this.vehicleComponent) {
          isValid = await this.vehicleComponent.submitForm();
        }
        break;
      case Views.SURVEY:
        if (this.surveyComponent) {
          isValid = await this.surveyComponent.submitForm();
        }
        break;
      case Views.REPAIR:
        if (this.repairComponent) {
          isValid = await this.repairComponent.submitForm();
        }
        break;
    }

    if (isValid) {
      this.currentStep += 1;
      this.activeView = this.steps[this.currentStep - 1].type;

    }
  }

  onPrevious() {
    this.currentStep -= 1;
    this.activeView = this.steps[this.currentStep - 1].type;
    this.loadClaimReport();
    this.addParamToCurrentUrl();
  }

  onBackToClaimList() {
    this.router.navigate(['dashboard/claims']);
  }

  addParamToCurrentUrl() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        step: this.currentStep,
        view: this.activeView
      },
      queryParamsHandling: 'replace'
    });
  }

  private handleRouteData(params: any, queryParams: any): void {
    // Handle route parameters
    if (params['id']) {
      this.claimId = params['id'];
    }

    // Handle query parameters with proper validation
    const step = queryParams['step'];
    const view = queryParams['view'];

    if (step && !isNaN(Number(step))) {
      this.currentStep = parseInt(step, 10); // Always specify radix
    }

    if (view && typeof view === 'string') {
      this.activeView = view;
    }

    // Reload data when route parameters change
    if (this.claimId) {
      this.user = this.authService.getCurrentUser();
      this.loadClaimReport();
    }
  }
}
